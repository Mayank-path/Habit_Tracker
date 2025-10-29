const express = require("express");
const mongod =  require("mongoose");
const  dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")

const authRoutes = require("./routes/authRoutes.js")
const habitRoutes = require("./routes/habitRoutes.js")


const app = express();

app.use(express.json())
app.use(cors({
  
  origin: "http://localhost:3000",
  credentials: true,
}));



const PORT = process.env.PORT

mongod.connect("mongodb://localhost:27017/habit_tracker")
.then(()=>console.log("connection with mongodb server succesfull"))
.catch(err => console.error("connection with server failed",err)) 

app.use("/api/auth", authRoutes)
app.use("/api/habits", habitRoutes)

app.get("/",(req,res)=>{
  res.send("This is some resonpnse from server ")
})

app.listen(PORT,()=>{
  console.log("server is running");
})