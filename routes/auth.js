const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/key.js')
const requireLogin = require('../middleware/requireLogin')

router.get('/protected', requireLogin, (req,res)=>{
    res.send("hello user")
})

router.post('/signup', (req,res) => {
//signup router is supposed to check the email of the user, if exist, return error,
//if not then register the user
    const {name, email, password, pic} = req.body
    if(!email || !password || !name) {
        return res.status(422).json({error:"please add all the fields"})
    }
    //res.json({message:"successfully posted"})
    User.findOne({email:email})
    .then((savedUser)=> {
        if(savedUser){
            return res.status(422).json({error:"user already existed with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword => {
            const user = new User({
                email,
                name,
                password:hashedpassword,
                pic
            })
            user.save()
            .then(()=>{
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    .catch(err=>{
        console.log(err)
    })

})

router.post('/signin', (req,res)=>{
    //signin router need to check if both email and password is present, if it is
    //then it proceed to check against the DB for if the email is registered
    //if the email is registered then need to check the hashedpassword if is the same
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please insert email or password"})
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({error:"email not registered"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch => {
            if(doMatch){
                //res.json({message:"successfully sign in"})
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id,name,email,followers,following, pic} = savedUser
                res.json({token, user:{_id,name,email,followers,following, pic}})
            }
            else{
                return res.status(422).json({error:"please insert correct email and password"})
            }
        })
        .catch(err =>{
            console.log(err)
        })
    })
})

router.post('/api/try', (req,res) =>{
  // test if need /api to return
  res.status(200).json({message:"this is /api/try route"})
  
})

router.post('/try', (req,res) =>{
  // test if need /api to return
  res.status(200).json({message:"this is /try route"})
  
})

module.exports = router