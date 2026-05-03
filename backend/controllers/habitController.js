const Habit = require('../models/habits')
const dayjs = require('dayjs')

const createHabit = async(req,res)=>{
    try{
        const {habit_name} = req.body;
        if(!habit_name || habit_name.trim()==="" ){
            return res.status(400).json({error: "habit name is required"})
        }

        const habit = new Habit({
            userId: req.user.userId,
            habit_name
        })

        await habit.save();
        res.status(201).json({message: "habit created successfully" , habit})

    }catch(err){
        res.status(500).json({error: err.message})
    }
    
};

const getHabit = async(req,res)=>{
    try{
        const habits = await Habit.find({userId : req.user.userId})
        return res.status(200).json({habits})
    }catch(err){
        res.status(500).json({error: "Server error"})
    }
}

const updateHabit = async(req,res)=>{
    try{
        const {newHabitName} = req.body
        if(!newHabitName || newHabitName.trim() ===""){
            return res.status(400).json({error :"New habit name is required"})
        }
        console.log(req.user.userId)
        console.log(req.params.id)
        const updateHabit = await Habit.findOneAndUpdate(
            {userId : req.user.userId ,_id : req.params._id},
            {habit_name : newHabitName},
            {new : true}

        )
        if(!updateHabit){
            return res.status(400).json({error : "Habit not found or not authorised"})
        }
        res.json({message: "habit updated succesfully",habit:updateHabit})


    }catch(err){
        console.log(err)
        return res.status(500).json({error : "server error"})
    }
}

const deleteHabit = async(req,res)=>{
    try{
        const {_id} = req.params
        const deleteHabit = await Habit.findOneAndDelete(
            {userId : req.user.userId, _id : _id}
        )
        if(!deleteHabit){
            return res.status(400).json({error : "Habit not found or not authorized"})
        }
        return res.json({message: "Habit deleted Succesfully", })
    }catch(err){
        console.log(err)
        return res.status(500).json({error: "Server error"})
    }
}

const markHabit = async (req, res) => {
    try {
      const { id } = req.params;
      const { date } = req.body;
  
      if (!date) {
        return res.status(400).json({ error: "date is not given" });
      }
  
      const habit = await Habit.findOne({
        _id: id,
        userId: req.user.userId
      });
  
      if (!habit) {
        return res.status(400).json({
          error: "no habit found to mark or not authorized"
        });
      }
  
      const alreadyMarked = habit.dates_completed.includes(date);
  
      if (alreadyMarked) {
        habit.dates_completed = habit.dates_completed.filter(
          (d) => d !== date
        );
      } else {
        habit.dates_completed.push(date);
      }
  
      await habit.save();
  
      return res.json({
        message: "Habit updated successfully",
        habit
      });
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Server error" });
    }
  };

  const completeHabit = async (req, res) => {
    try {
        const todayStr = dayjs().format("YYYY-MM-DD");
  
      const habits = await Habit.find({
        userId: req.user.userId
      });
  
      const completedToday = habits.filter((habit) =>
        habit.dates_completed?.includes(todayStr)
      );

      console.log("todayStr =", todayStr);
  
      return res.json({
        count: completedToday.length,
        habits: completedToday
      });
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "server error" });
    }
  };
module.exports = {createHabit,getHabit,updateHabit,deleteHabit,markHabit,completeHabit}