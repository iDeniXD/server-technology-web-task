const User = require("../model/user");
const Role = require("../model/role")

const express = require('express')
const userRouter = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validation = require('../middleware/validation');

const config = process.env;


userRouter.post("/register", validation.register, async (req, res) => {
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;
    
        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });
    
        // Create access token
        const access_token = jwt.sign(
            { user_id: user._id, email },
            config.ACCESS_TOKEN_KEY,
            {
                expiresIn: "15m",
            }
        );

        // Create refresh token
        const refresh_token = jwt.sign(
            { user_id: user._id, email },
            config.REFRESH_TOKEN_KEY,
            { expiresIn: '3d' });

        // Assigning refresh token in http-only cookie 
        res.cookie('jwt', refresh_token, { httpOnly: true, 
            sameSite: 'None', secure: true, 
            maxAge: 3 * 24 * 60 * 60 * 1000 });

        // save user token
        user.access_token = access_token;
    
        // return new user
        return res.status(201).json(user);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Something went wrong!")
    }
});

// Login
userRouter.post("/login", validation.login, async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate if user exist in database
        const user = await User.findOne({ email });

        // Create access token
        const access_token = jwt.sign(
            { user_id: user._id, email },
            config.ACCESS_TOKEN_KEY,
            { expiresIn: "15m" }
        );

        // Create refresh token
        const refresh_token = jwt.sign(
            { user_id: user._id, email },
            config.REFRESH_TOKEN_KEY,
            { expiresIn: '3d' });


        // Assigning refresh token in http-only cookie 
        res.cookie('jwt', refresh_token, { httpOnly: true, 
            sameSite: 'None', secure: true, 
            maxAge: 3 * 24 * 60 * 60 * 1000 });

        // save user token
        user.access_token = access_token;

        // user
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(401).send("Something went wrong!")
    }
});

userRouter.post("/revoke", async (req, res) => {
    try {
        res.cookie('jwt', "", { httpOnly: true, 
            sameSite: 'None', secure: true, 
            maxAge: 0 });

        res.status(200).send()
    } catch (err) {
        return res.status(401).send("Something went wrong!")
    }
});

userRouter.get("/refresh", async (req, res) => {
    try{
        const refresh_token = req.cookies.jwt;
        const decoded_refresh = jwt.verify(refresh_token, config.REFRESH_TOKEN_KEY);
        req.user = decoded_refresh;

        const new_access_token = jwt.sign(
            { user_id: req.user.user_id, email: req.user.email },
            config.ACCESS_TOKEN_KEY,
            {
                expiresIn: "15m",
            }
        );

        // Create refresh token
        const new_refresh_token = jwt.sign(
            { user_id: req.user.user_id, email: req.user.email },
            config.REFRESH_TOKEN_KEY,
            { expiresIn: '3d' });

        // Assigning refresh token in http-only cookie 
        res.cookie('jwt', new_refresh_token, { httpOnly: true, 
            sameSite: 'None', secure: true, 
            maxAge: 3 * 24 * 60 * 60 * 1000 });

        console.log("Both tokens have been refreshed");
        return res.status(200).json({access_token: new_access_token}) 
    } catch (err) {
        console.log("None of the tokens have been refreshed")
        return res.status(401).send("A refresh is required");
    }
})

module.exports = userRouter