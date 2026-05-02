const express = require('express')
const router =express.Router()
const Habit = require("../models/habits")
const authMiddleware = require("../middleware/auth")
const habitController = require("../controllers/habitController")

router.post("/addHabit",authMiddleware,habitController.createHabit)

router.get("/showHabit",authMiddleware,habitController.getHabit)

router.put("/updateHabit/:_id", authMiddleware,habitController.updateHabit)
   
router.delete("/deleteHabit/:_id",authMiddleware,habitController.deleteHabit)

router.put("/markHabit/:id",authMiddleware, habitController.markHabit)

router.get("/completeHabit",authMiddleware,habitController.completeHabit)

module.exports = router;