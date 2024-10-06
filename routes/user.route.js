const { Router } = require('express');
const { userModel } = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { userMiddelwares } = require('../middlewares/userMiddelwares');
const { generateOtp } = require('../services/otp.service');
const { sendOtpEmail } = require('../services/email.services');
const userRouter = Router();

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    password: Joi.string().min(6).required(),
}).xor('email', 'phoneNumber');

userRouter.post('/register', async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const { name, email, password, phoneNumber } = req.body;

    try {
        const existingUser = await userModel.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already registered with this email or phone number"
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = await userModel.create({
            name,
            email: email || "",
            phoneNumber: phoneNumber || "",
            password: hashedPassword
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

const loginSchema = Joi.object({
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    password: Joi.string().min(6).required(),
}).or('email', 'phoneNumber');

userRouter.post('/login', async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { email, phoneNumber, password } = req.body;
    try {
        const user = await userModel.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email/phone or password"
            });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email/phone number or password"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

userRouter.post('/logout', userMiddelwares, (req, res) => {
    const userId = req.user;

    if (!userId) {
        return res.status(400).json({ message: "User not logged in" });
    }

    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.status(200).json({ message: "Logout successful" });
});

let otpStorage = new Map(); // Using Map for better performance
userRouter.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist." });
        }

        const otp = generateOtp();
        otpStorage.set(email, otp); // Store OTP temporarily

        await sendOtpEmail(email, otp); // Send OTP via email
        res.status(200).json({ message: `OTP sent to your email. ${otp}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

userRouter.post('/resetPassword', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (otpStorage.get(email) === otp) {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        user.password = await bcryptjs.hash(newPassword, 10);
        await user.save();
        otpStorage.delete(email); // Clear OTP after use
        res.status(200).json({ message: "Password reset successfully." });
    } else {
        res.status(400).json({ message: "Invalid OTP." });
    }
});

module.exports = { userRouter };
