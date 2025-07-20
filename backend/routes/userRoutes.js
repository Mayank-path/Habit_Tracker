const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Register
router.post('/register', async (req, res) => {
  const { username, email_id, password } = req.body;

  if (!username || !email_id || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email_id });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email_id, password });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { username, email_id, _id: newUser._id }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email_id, password } = req.body;

  try {
    const user = await User.findOne({ email_id, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        username: user.username,
        email_id: user.email_id,
        _id: user._id
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Habit
router.post('/:userId/addHabit', async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.habits.push({ name, completedDates: [] });
    await user.save();

    res.json({ message: "Habit added", habits: user.habits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Habit
router.delete('/:userId/deleteHabit/:habitName', async (req, res) => {
  const { userId, habitName } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.habits = user.habits.filter(habit => habit.name !== habitName);
    await user.save();

    res.json({ message: 'Habit deleted', habits: user.habits });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit Habit
router.put('/:userId/editHabit/:oldHabitName', async (req, res) => {
  const { userId, oldHabitName } = req.params;
  const { newName } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const habit = user.habits.find(h => h.name === oldHabitName);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    habit.name = newName;
    await user.save();

    res.json({ message: 'Habit renamed', habits: user.habits });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete Habit
router.post('/:userId/completeHabit', async (req, res) => {
  const { habitName } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const habit = user.habits.find(h => h.name === habitName);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const today = new Date().toISOString().split('T')[0];
    const alreadyMarked = habit.completedDates.some(date =>
      new Date(date).toISOString().split('T')[0] === today
    );

    if (alreadyMarked) {
      return res.json({ message: "Already marked complete for today" });
    }

    habit.completedDates.push(new Date());
    await user.save();

    res.json({ message: "Habit marked complete", habit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats
router.get('/:userId/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const stats = user.habits.map(habit => {
      const dates=habit.completedDates.map(date => 
        new Date(date).toISOString().split('T')[0]
      );
      
      return {
        name: habit.name,
        dates: dates,
        totalCompleted: dates.length
      };
    });

    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;