const express = require('express')
const router =express.Router()
const Habit = require("../models/habits")
const authMiddleware = require("../middleware/auth")

router.post("/addHabit",authMiddleware,async(req,res)=>{
    try{
        const {habit_name, description} = req.body;

        const habit = new Habit({
            userId: req.user.userId,
            habit_name,description,
            frequency: 0
        })

        await habits.save();
        res.status(201).json({message: "habit created successfully" , habit})

    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.get("/showHabit",authMiddleware,async (req,res)=>{
    try{
        const habits = await Habit.find({userId: req.user.userId})
        res.json(habits)
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put("/update", authMiddleware, async (req,res)=>{
    try{
        
    }catch(err){

    }

})

module.exports = router;