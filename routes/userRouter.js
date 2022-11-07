const User = require("../model/user");
const Role = require("../model/role")

const express = require('express')
const userRouter = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = process.env;


userRouter.post("/register", async (req, res) => {
    try {
        // Get user input
        const { first_name, last_name, gender, email, password, role, approved_by } = req.body;
    
        // Validate user input
        if (!(first_name && last_name && email && password && role )) {
            return res.status(400).send("All input is required");
        }

        referencedRole = await Role.findOne({role: role});
        if (!(referencedRole)) {
            return res.status(400).send(`Such role ${role} does not exist!`);
        }
    
        // check if user already exist
        // Validate if user exist in database
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }
    
        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in database
        const user = await User.create({
            first_name,
            last_name,
            gender,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
            role: referencedRole,
            approved_by
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
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Something went wrong!")
    }
});

// Login
userRouter.post("/login", async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }
        // Validate if user exist in database
        const user = await User.findOne({ email });


        if (user && (await bcrypt.compare(password, user.password))) {

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
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
        return res.status(200).send("Something went wrong!")
    }
});

module.exports = userRouter