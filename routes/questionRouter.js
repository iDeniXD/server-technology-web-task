const express = require('express');
const questionRouter = express.Router()
const questionController = require('../controllers/questionController');

const { create_question, update_question } = require('../middleware/validation');

questionRouter.get("/", questionController.getAllQuestions);
questionRouter.get("/:id", questionController.getQuestionById);
questionRouter.post("/", create_question, questionController.postQuestion);
questionRouter.put("/:id", update_question, questionController.updateQuestionById);
questionRouter.delete("/:id", questionController.deleteQuestionById);

module.exports = questionRouter