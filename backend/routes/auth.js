const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//USER REGISTER
router.post("/register", async (req,res) =>{
    try{
        const {name,email, password} = req.body;
         if(!name || !email || !password){
            return res.status(400).json({message: "PLEASE ENTER ALL FIELD"});
         }
        const existuser = await User.findOne({ email});
        if(existuser){
            return res.status(400).json({message: "THIS EMAIL ALREADY EXIST"});
        }    
    const salt = await  bcrypt.genSalt(10);
    const hashedPssword = await bcrypt.hash(password,salt);
    
    const newUser = new User({ name, email, password});
    await newUser.save();

    const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET , { expiresIn: "1h", });

    res.status(200).json({ message : "WELCOME TO YOUR ACCOUNT!", token});
    }
    catch(err){
        res.json({message: "OOPS! IT SEEMS SOMETHING WENT WRONG. PLEASE TRY AGAIN!" , error : err.message});
    }
});

//USER LOGIN
router.post("/login", async (req,res) =>{
    try{
         const { email, password} = req.body;
          if(!email || !password){
            return res.status(400).json({message: "PLEASE ENTER ALL FIELD"});
         }
        const user = await User.findOne({ email});
        if(!user){
            return res.status(400).json({message: "NO USER FOUND WITH THIS EMAIL!"});
        } 
        const isMatch = await bcrypt.compare(password, user.password);
         if(!isMatch){
            return res.status(400).json({message: "INVALID EMAIL OR PASSWORD"});
        } 
        
    const token = jwt.sign({id : user._id}, process.env.JWT_SECRET , { expiresIn: "1h", });

    res.status(200).json({ message : "LOGIN SUCCESSFUL!", token,
        user: user.name,
        email:user.email
    });
    }
    catch(err){
        res.json({message: "OOPS! IT SEEMS SOMETHING WENT WRONG. PLEASE TRY AGAIN!" , error : err.message});
    }
});   
module.exports= router;