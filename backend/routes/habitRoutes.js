const express = require('express')
const router =express.Router()
const Habit = require("../models/habits")
const authMiddleware = require("../middleware/auth")

router.post("/addHabit",authMiddleware,async(req,res)=>{
    try{
        const {habit_name} = req.body;

        const habit = new Habit({
            userId: req.user.userId,
            habit_name,
            frequency: 0
        })

        await habit.save();
        res.status(201).json({message: "habit created successfully" , habit})

    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.get("/showHabit",authMiddleware,async (req,res)=>{
    try{
        const habits = await Habit.find({userId: req.user.userId})
        res.status(200).json(habits)
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put("/update/:id", authMiddleware, async (req,res)=>{
    try{
        const {newHabitName} = req.body
        const updateHabit = await Habit.findOneAndUpdate(
            {_id: req.params.id},
            { habit_name:newHabitName },
            {new : true }
        )

        if(!updateHabit){
            return res.status(404).json({error: "habit not found"})
        }

        res.json({message: "habit updated successfully"})
    }catch(err){
        res.status(500).json({error: err.message})
    }

})

router.delete("/deleteHabit/:_id", authMiddleware, async(req,res)=>{
    try{
        const delteHabit = await Habit.findOneAndDelete(
            {
                _id: req.params._id, 
                userId: req.user.userId,
            }
        )

        if(!delteHabit){
            return res.status(404).json({error: "habit not found"})
        }
        res.json({message: "habit deleted successfully"})
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put("/markHbait/:id",authMiddleware, async(req,res)=>{
    try{
        const {date} = req.body;
        const habit = await Habit.findOneAndUpdate(
            {_id: req.params.id, userId: req.user.userId},
            {$addToSet: { dates_completed: date}},
            {new: true}
        )
        res.json({message : "habit marked as completed"})
    }catch(err){
        res.status(500).json({error: err.message})
    }
})
router.get("/completeHabit",authMiddleware,async(req,res)=>{
    try{
        const now = new Date();

        // Create local start and end of day
        const startOfDayLocal = new Date(now);
        startOfDayLocal.setHours(0, 0, 0, 0);
    
        const endOfDayLocal = new Date(now);
        endOfDayLocal.setHours(23, 59, 59, 999);
    
        // Convert local times to UTC (Mongo stores UTC)
        const startOfDayUTC = new Date(startOfDayLocal.toISOString());
        const endOfDayUTC = new Date(endOfDayLocal.toISOString());
    
        const habits = await Habit.find({
          userId: req.user.userId,
          dates_completed: {
            $elemMatch: {
              $gte: startOfDayUTC,
              $lte: endOfDayUTC
            }
          }
        });
    
        res.json({
          date: new Date().toISOString().split("T")[0],
          count: habits.length,
          habits
        });
    }catch(err){
        res.status(500).json({error: err.message})

    }
})

module.exports = router;