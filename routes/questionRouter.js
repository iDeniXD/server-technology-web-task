const Role = require("../model/role");

const express = require('express');
const Question = require("../model/question");
const User = require("../model/user");
const questionRouter = express.Router()

// Add a question
questionRouter.post("/", async (req, res) => {
    try {
        // Get role input
        const { topic, content } = req.body;

        const author = req.user._id
        const date = Date.now()
    
        // Validate role input
        if (!( date && topic && content && author )) {
            return res.status(400).send("All input is required");
        }

        referencedAuthor = await User.findOne({_id: author});
        if (!(referencedAuthor)) {
            return res.status(400).send(`Such user ${referencedAuthor} does not exist!`);
        }
    
        // Create role in my database
        const question = await Question.create({
            date,
            topic,
            content,
            author: referencedAuthor
        });
    
        // return new role
        res.status(201).json(question);
    } catch (err) {
        console.log(err);
    }
});

// Get
questionRouter.get("/", async (req, res) => {
    const questions = await Question.find()
    res.status(201).json(questions)
});

// Get
questionRouter.get("/:id", async (req, res) => {
    let question = await Question.findById( req.params.id )
    question.author = await User.findById( question.author )
    res.status(201).json(question)
});

module.exports = questionRouter