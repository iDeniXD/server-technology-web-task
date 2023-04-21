const express = require('express');
const Comment = require("../model/comment");
const User = require("../model/user");
const Question = require("../model/question");
const commentRouterPostGet = express.Router({ mergeParams: true })
const commentRouterPutDelete = express.Router({ mergeParams: true })

const { comment_validator } = require('../middleware/validation');

// Get
commentRouterPostGet.get("/", async (req, res) => {
    const { questionID } = req.params;
    try{
        const comments = await Comment.find({question: questionID})
        res.status(200).json(comments)
    } catch (err) {
        console.error(err);
        res.status(505).send('Server error')
    }
    
});

// Add a question
commentRouterPostGet.post("/", comment_validator, async (req, res) => {
    try {
        // Get question input
        const { content, commentID } = req.body;
        const { questionID } = req.params;

        const date = Date.now()

        referencedQuestion = await Question.findById(questionID);
        if (!(referencedQuestion)) {
            return res.status(400).send(`Such question does not exist!`);
        }

        var referencedComment = null;
        if (commentID !== undefined) {
            referencedComment = await Comment.findById(questionID);
            if (referencedComment == null) {
                return res.status(400).send(`Such question does not exist!`);
            }
        }

        const comment = await Comment.create({
            date,
            content,
            author: req.user._id,
            parent_comment: referencedComment,
            question: referencedQuestion
        });

        await comment.populate('author')
    
        // return new question
        res.status(201).json(comment);
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
});

commentRouterPutDelete.put("/", comment_validator, async (req, res) => {
    const { content, commentID } = req.body;
    const { id } = req.params;
    try {
        const comment = await Comment.findById( id );

        if (comment.author.equals(req.user._id)) {
            comment.content = content ?? comment.content;
            comment.commentID = commentID ?? comment.commentID;
            await comment.save()
            await comment.populate('author')
            return res.status(201).json(comment);
        } else {
            return res.status(403).send('Only the author can edit this comment!');
        }
        
    } catch (e) {
        console.log(e)
        res.status(400).send("Unknown error")
    }
    
});

commentRouterPutDelete.delete("/", async (req, res) => {
    try {
        const comment = await Comment.findById( req.params.id )

        if (comment.author.equals(req.user._id)) { // TODO: || req.user.role === ''
            await comment.delete()
            return res.status(204).send()
        } else {
            return res.status(403).send()
        }
        
    } catch (e) {
        console.log(e)
        res.status(400).send("Unknown error")
    }
    
});

module.exports = [commentRouterPostGet, commentRouterPutDelete]