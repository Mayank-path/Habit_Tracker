
const m=require("mongoose")

const user_data= new m.Schema({
  userName:{type: String, required: true},
  email:{type: String, required: true},
  password:{type:String, required: true}
})

const User= m.model("User",user_data);

module.exports=User;