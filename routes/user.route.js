const { Router } = require('express');
const { userModel } = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userRouter = Router();


const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).optional(), // Make email optional
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).optional(), // Make phoneNumber optional
    password: Joi.string().min(6).required(),
}).xor('email', 'phoneNumber'); // Ensure either email or phoneNumber is present

userRouter.post('/register', async (req, res) => {
    // Validation schema using Joi


    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const { name, email, password, phoneNumber } = req.body;

    try {
        // Check for existing user based on either email or phone number
        const existingUser = await userModel.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already registered with this email or phone number"
            });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create a new user
        const newUser = await userModel.create({
            name,
            email: email || "", // Set email to empty if not provided
            phoneNumber: phoneNumber || "", // Set phone number to empty if not provided
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",

        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

const loginSchema = Joi.object({
    email: Joi.string()
        .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) // Regex for email validation
        .optional(),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{10}$/) // Regex for phone number validation
        .optional(),
    password: Joi.string().min(6).required(),
}).or('email', 'phoneNumber')


userRouter.post('/login',async(req,res) =>{
    const {error} = loginSchema.validate(req.body)

    if(error){
        return res.status(400).json({ message: error.details[0].message });
    }

    const {email, phoneNumber,password} = req.body
    try {
        const user = await userModel.findOne({
            $or: [{ email }, { phoneNumber }] 
        })

        if(!user){
            return res.status(400).json({
                message: "invalid email/ phone or password"
            })
        }

        const isPasswordValid = await bcryptjs.compare(password,user.password)
        
        if(!isPasswordValid){
            return res.status(400).json({
                message:"Invalid email/phone number or password"
            })
        }

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {
                expiresIn:'1h'
            }
        )

        res.cookie('token',token,{httpOnly:true})

        res.status(200).json({
           message: "Login successful",
//  not pass direct user because not want to send password in response
           user:{
            id:user._id,
            name:user.name,
            email:user.email,
            phoneNumber:user.phoneNumber,
           },
           token
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
})


userRouter.post('/logout', (req,res)=>{
    res.cookie('token','', {expires :new Date(0), httpOnly:true})
          res.status(200).json({
            message:"logout successful"
          })
})


module.exports = {
    userRouter
};
