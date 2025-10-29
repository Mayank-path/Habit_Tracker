const express = require('express')
const router= express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET


router.post("/register",async(req,res)=>{
    try{
        const {userName, email, password} = req.body;

        const extingUser = await User.findOne({email});
        if(extingUser){
            return res.status(400).json({error: "User already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = new User({
            userName,
            email,
            password:hashedPassword
        })
        
        const abc = await user.save()
        console.log(abc)

        const token = jwt.sign({ userId: user._id}, JWT_SECRET , {expiresIn : '1w'})
        res.status(201).json({
            message: "User registered succsfully",
            token,
            userId : user._id
        })
    }catch(err){
        res.status(500).json({error: "user registration failed"})
        console.log(err)
        console.log(req.body)
    }
    
    
})

router.post("/login",async(req,res)=>{
    try{
        const { email,password } = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({error: "Invalid email or password"})
        }
        
        const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({error: "Invalid email or password"})

        }

        const token = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn: "1w"})

        res.json({message:"login successfull",token,userId:user._Id})
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

module.exports = router;