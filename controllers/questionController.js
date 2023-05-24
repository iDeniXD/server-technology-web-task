const Question = require("../model/question");
const Comment = require("../model/comment");

exports.getAllQuestions = async (req, res) => {
    try{
        const phrase = req.query.q;
        const questions = await Question.find({ 
            $or: [
                {topic: {$regex: `.*${phrase ?? ''}.*`}},
                {content: {$regex: `.*${phrase ?? ''}.*`}} 
            ]
        })
            .sort({date: 'desc'})
            .populate('author')
        res.status(200).json(questions)
    } catch (err) {
        console.error(err)
        res.status(400).send({message: 'Something went wrong'})
    }
    
}

exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById( req.params.id ).populate('author')
        if (!question) { 
            return res.status(404).send({message: "Question does not exist"}); 
        }
        
        const comments = await Comment.find({question: question._id}).populate({path: 'author', select: 'first_name last_name'}).sort({date: 'desc'})
        question.comments = comments;

        res.status(200).json(question)
    } catch (e) {
        console.log(e)
        if (e.name === 'CastError') {
            return res.status(404).send({message: 'Invalid ID'});
        }
        res.status(400).send({message: "Something went wrong"})
    }
    
}

exports.postQuestion = async (req, res) => {
    try {
        const { topic, content } = req.body;

        const question = await Question.create({
            topic,
            content,
            author: req.user._id
        });
    
        res.status(201).send(question);
    } catch (err) {
        console.log(err);
        res.status(402).send({})
    }
}

exports.updateQuestionById = async (req, res) => {
    try {
        const qID = req.params.id;
        const {topic, content, accepted_comment} = req.body;
        
        const question = await Question.findById( qID )
        if (!question) {
            return res.status(404).send({message: 'Question does not exist'});
        }

        const comment = Comment.findById(accepted_comment);
        if (comment.question && !comment.question.equals(qID)) {
            return res.status(403).send({message: 'The comment to be accepted does not exist'});
        }

        if (!question.author.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).send({message: 'Only author can update its own question'});
        }

        question.topic = topic ?? question.topic;
        question.content = content ?? question.content;
        question.accepted_comment = accepted_comment ?? question.accepted_comment;
        await question.save()
        return res.status(201).send(question);


    } catch (e) {
        console.log(e)
        res.status(400).send({message: "Something went wrong"})
    }
    
}

exports.deleteQuestionById = async (req, res) => {
    try {
        const question = await Question.findById( req.params.id )

        if (!question.author.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).send({message: 'Only author can delete this question'})
        }
        await Promise.all([
            Question.findByIdAndDelete(req.params.id),
            Comment.deleteMany({ question: req.params.id })
        ])
        return res.status(200).send({})
        
    } catch (e) {
        console.log(e)
        res.status(400).send({message: "Something went wrong"})
    }
    
}
