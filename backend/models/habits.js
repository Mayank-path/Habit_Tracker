
const moongose = require("mongoose")

const habit_data = new moongose.Schema({
    userId:{type:moongose.Schema.Types.ObjectId , ref:"User" , required:true},
    habit_name:{type:String, required:true},
    description:{type:String, required:true, default:""},
    createdAt:{type:Date,require:true, default:Date.now},
    dates_completed:{type:[Date],default:[]},
    frequency:{type:Number,default:0}
})

const habit = moongose.model("habit",habit_data)
module.exports=habit;