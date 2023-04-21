const express = require('express');
const Question = require("../model/question");
const User = require("../model/user");
const Comment = require("../model/comment");
const questionRouter = express.Router()

const { create_question, update_question } = require('../middleware/validation');

// Add a question
questionRouter.post("/create", create_question, async (req, res) => {
    try {
        // Get question input
        const { topic, content } = req.body;

        const author = req.user._id
        const date = Date.now()

        // TODO: remove? There is a middleware that does it. For question create it is possible to use req.user
        referencedAuthor = await User.findOne({_id: author});
        if (!(referencedAuthor)) {
            return res.status(400).send(`Such user ${referencedAuthor} does not exist!`);
        }
    
        // Create question in my database
        const question = await Question.create({
            date,
            topic,
            content,
            author: referencedAuthor
        });
    
        // return new question
        res.status(201).json(question);
    } catch (err) {
        console.log(err);
        res.status(402).send()
    }
});

// Get
questionRouter.get("/", async (req, res) => {
    const phrase = req.query.q;
    console.log({topic: {$regex: `.*${phrase ?? ''}.*`}},
    {content: {$regex: `.*${phrase ?? ''}.*`}} );
    try{
        const questions = await Question.find({ 
            $or: [
                {topic: {$regex: `.*${phrase ?? ''}.*`}},
                {content: {$regex: `.*${phrase ?? ''}.*`}} 
            ]
        }).populate('author')
        res.status(200).json(questions)
    } catch (err) {
        console.error(err)
        res.status(404).send() // TODO: test this
    }
    
});

questionRouter.get("/:id", async (req, res) => {
    try {
        const question = await Question.findById( req.params.id ).populate('author')
        const comments = await Comment.find({question: question._id}).populate({path: 'author', select: 'first_name last_name'}).sort({date: 'desc'})
        question.comments = comments;
        if (!question) { return res.status(404).send("Question does not exist"); }

        res.status(200).json(question)
    } catch (e) {
        console.log(e)
        res.status(400).send("Unknown error") // TODO: test this
    }
    
});

questionRouter.delete("/:id", async (req, res) => {
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

questionRouter.put("/:id", update_question, async (req, res) => {
    try {
        const qID = req.params.id;
        const {topic, content, accepted_comment} = req.body;
        
        const question = await Question.findById( qID )
        if (!question) {
            return res.status(404).send('Question does not exist');
        }

        const comment = Comment.findById(accepted_comment);
        if (!comment.question.equals(qID)) {
            return res.status(403).send('The comment to be accepted does not exist');
        }

        if (question.author.equals(req.user._id)) {
            // TODO: use question.save()
            // TODO: why update date?
            question.topic = topic ?? question.topic;
            question.content = content ?? question.content;
            question.accepted_comment = accepted_comment ?? question.accepted_comment;
            await question.save()
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