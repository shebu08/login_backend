const express = require('express');
const User = require('../model/userSchema');
const app = express()
const bcrypt = require("bcryptjs")

// For User Registration

app.post('/register', async(req , res)=>{

    const {fname, email, password, cpassword } = req.body;

    // console.log("fname ",fname);
    // console.log("email ",email);
  

    if(!fname ||  !email || !password || !cpassword){
        // res.status(422).json({error : "fill All The detail"})
        res.status(422).json({ error: "fill all the details" })
    }
    try {
        const presuser = await User.findOne({email : email});
        if(presuser){
            res.status(422).json({error : "Email is Already Exite"})
        }else if(password !== cpassword){
            res.status(422).json({error : "Password is Not Match"})
        }else{
            const finalUser = new User({
                fname, email , password , cpassword
            });
            // here password  hasing 
            const storeData = await finalUser.save();
            console.log(storeData)
            res.status(201).json( {status :201 , storeData} )
            
        }
        
    } catch (error) {
        res.status(422).json(error)
        console.log('catch block error')
        
    }
})


// User Login Api;

app.post('/login' , async(req , res)=>{
    // console.log(req.body);
    const {email , password}= req.body
    if(  !email || !password){
        // res.status(422).json({error : "fill All The detail"})
        res.status(422).json({ error: "fill all the details" })
    }
    try {
        const userVailed  = await User.findOne({email : email});

        if(userVailed){
            const isMatch = await bcrypt.compare(password, userVailed.password);
            if(!isMatch){
                res.status(422).json({ error: "Password is Not Match" })

            }else{
                // Token generate
                const token = await userVailed.generateAuthtoken();
                // console.log(token);
                
                // cookies generate
                res.cookie("usercookiie", token,{
                    expires : new Date(Date.now()+9000000),
                    httpOnly : true
                });
                const result  = {
                    userVailed,
                    token,

                }
                res.status(201).json({status : 201, result})

            }
        }
        
    } catch (error) {
        res.status(422).json(error)
        console.log('catch block error')
        
    }
    

})

module.exports = app;