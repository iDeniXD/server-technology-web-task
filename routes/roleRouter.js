const Role = require("../model/role");

const express = require('express')
const roleRouter = express.Router()

roleRouter.post("/", async (req, res) => {
    try {
        // Get role input
        const { role } = req.body;
    
        // Validate role input
        if (!( role )) {
            return res.status(400).send("All input is required");
        }
    
        // check if role already exist
        // Validate if role exist in my database
        const roleExists = await Role.findOne({ role });
    
        if (roleExists) {
            return res.status(409).send("Role Already Exist. Choose another one");
        }
    
        // Create role in my database
        const roleInstance = await Role.create({
            role
        });
    
        // return new role
        res.status(201).json(roleInstance);
    } catch (err) {
        console.log(err);
    }
});

// Login
roleRouter.get("/", async (req, res) => {
    try{
        const roles = await Role.find({})
        res.status(201).json(roles);
    } catch (err) {
        console.log(err);
    }
});

module.exports = roleRouter