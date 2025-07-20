

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

const Manage = () => {
  const [showInput, setShowInput] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habits, setHabits] = useState([]);
  const { user } = useAuth();

  const handleAddHabitClick = () => setShowInput(true);

  const handleHabitSubmit = async () => {
    if (!habitName.trim()) return alert("Habit name cannot be empty");

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${user?._id}/addHabit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: habitName })
      });

      const data = await response.json();

      if (response.ok) {
        setHabits(data.habits);
        setHabitName('');
        setShowInput(false);
      } else {
        alert(data.message || 'Failed to add habit');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const handleDeleteHabit = async (habitNameToDelete) => {
    if (!window.confirm(`Delete habit "${habitNameToDelete}"?`)) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/${user?._id}/deleteHabit/${habitNameToDelete}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setHabits(prev => prev.filter(h => h.name !== habitNameToDelete));
      } else {
        alert('Failed to delete habit');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const handleEditHabit = async (oldHabitName) => {
    const newHabitName = prompt('Enter new habit name:', oldHabitName);
    if (!newHabitName || newHabitName === oldHabitName) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/${user?._id}/editHabit/${oldHabitName}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newName: newHabitName })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setHabits(data.habits);
      } else {
        alert(data.message || 'Failed to rename habit');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const fetchHabits = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${user?._id}/stats`);
      const data = await response.json();
      if (data.stats) setHabits(data.stats.map(h => ({ name: h.name })));
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    if (user?._id) fetchHabits();
  }, [user?._id]);

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Manage Habits</h2>
        <button
          onClick={handleAddHabitClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Habit
        </button>
      </div>

      {showInput && (
        <div className="mb-4 bg-gray-100 p-4 rounded">
          <input
            type="text"
            placeholder="Enter habit name"
            className="w-full border px-3 py-2 rounded mb-2"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
          />
          <button
            onClick={handleHabitSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Habit
          </button>
        </div>
      )}

      {habits.length > 0 ? (
        <div className="grid gap-3">
          {habits.map((habit, index) => (
            <div key={index} className="border rounded p-3 shadow-sm bg-gray-50 flex justify-between items-center">
              <span className="text-lg font-medium">{habit.name}</span>
              <div className="flex gap-4">
                <button


onClick={() => handleEditHabit(habit.name)}
                  className="hover:bg-blue-600 hover:text-white rounded px-6 py-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteHabit(habit.name)}
                  className="hover:bg-blue-600 hover:text-white rounded px-4 py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">
          No habits created yet. Add your first habit to get started!
        </p>
      )}
    </div>
  );
};

export default Manage;