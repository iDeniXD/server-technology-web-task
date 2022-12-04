const Role = require("../model/role");

const express = require('express');
const Question = require("../model/question");
const User = require("../model/user");
const questionRouter = express.Router()

const { create_question } = require('../middleware/validation');

// Add a question
questionRouter.post("/create", create_question, async (req, res) => {
    try {
        // Get role input
        const { topic, content } = req.body;

        const author = req.user._id
        const date = Date.now()

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
        res.status(402).send()
    }
});

// Get
questionRouter.get("/", async (req, res) => {
    try{
        const questions = await Question.find()
        for (let question of questions) {
            question.author = await User.findById( question.author )
        }
        res.status(200).json(questions)
    } catch {
        res.status(404).send() // TODO: test this
    }
    
});

// Get
questionRouter.get("/:phrase", async (req, res) => {
    try {
        const phrase = req.params.phrase
        let questions = await Question.find({ 
            $or: [
                {topic: {$regex: '.*'+phrase+'.*'}},
                {content: {$regex: '.*'+phrase+'.*'}} 
            ]
        })

        res.status(200).json(questions)
    } catch {
        res.status(404).send("Unknown error")
    }
    
});

questionRouter.get("/id/:id", async (req, res) => {
    try {
        const question = await Question.findById( req.params.id )
        if (!question) { return res.status(404).send("Question does not exist"); }

        question.author = await User.findById( question.author )
        
        res.status(200).json(question)
    } catch (e) {
        console.log(e)
        res.status(400).send("Unknown error") // TODO: test this
    }
    
});

questionRouter.delete("/id/:id", async (req, res) => {
    try {
        const question = await Question.findById( req.params.id )

        if (question.author.equals(req.user._id)) {
            await Question.findByIdAndDelete(req.params.id)
            return res.status(204).send()
        } else {
            return res.status(403).send()
        }
        
    } catch (e) {
        console.log(e)
        res.status(400).send("Unknown error")
    }
    
});

questionRouter.put("/id/:id", async (req, res) => {
    try {
        const qID = req.params.id;
        const {topic, content} = req.body;
        
        let question = await Question.findById( qID )

        if (question.author.equals(req.user._id)) {
            question = await Question.findByIdAndUpdate(qID, {topic, content, date: Date.now()}, {new: true})
            question.author = await User.findById(req.user._id)
            return res.status(201).json(question);
        } else {
            return res.status(403).send();
        }


    } catch (e) {
        console.log(e)
        res.status(400).send("Unknown error")
    }
    
});

module.exports = questionRouter