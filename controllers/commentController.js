const Comment = require("../model/comment");
const User = require("../model/user");
const Question = require("../model/question");

exports.getComments = async (req, res) => {
    const { questionID } = req.params;
    try{
        const comments = await Comment.find({question: questionID})
        res.status(200).json(comments)
    } catch (err) {
        console.error(err);
        res.status(400).send({message: 'Something went wrong'})
    }
    
}

exports.postComment = async (req, res) => {
    try {
        const { content, commentID } = req.body;
        const { questionID } = req.params;

        referencedQuestion = await Question.findById(questionID);
        if (!(referencedQuestion)) {
            return res.status(400).send(`Such question does not exist!`);
        }

        var referencedComment = null;
        if (commentID !== undefined) {
            referencedComment = await Comment.findById(questionID);
            if (referencedComment == null) {
                return res.status(400).send(`Such comment does not exist!`);
            }
        }

        const comment = await Comment.create({
            content,
            author: req.user._id,
            parent_comment: referencedComment,
            question: referencedQuestion
        });

        await comment.populate('author')
    
        res.status(201).json(comment);
    } catch (err) {
        console.log(err);
        res.status(402).send(err)
    }
}

exports.updateCommentById = async (req, res) => {
    const { content, commentID } = req.body;
    const { id } = req.params;
    try {
        const comment = await Comment.findById( id );

        if (!comment.author.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).send({message: 'Only the author can edit this comment!'});
        }
        comment.content = content ?? comment.content;
        comment.commentID = commentID ?? comment.commentID;
        await comment.save()
        await comment.populate('author')
        return res.status(201).json(comment);
        
    } catch (e) {
        console.log(e)
        res.status(400).send({message: "Something went wrong"})
    }
    
}

exports.deleteCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById( req.params.id )

        if (!comment.author.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).send({message: 'Only authors can delete their comments'})
        }
        
        await comment.delete()
        return res.status(200).send({})
    } catch (e) {
        console.log(e)
        res.status(400).send({message: "Something went wrong"})
    }
    
}