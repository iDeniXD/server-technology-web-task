const express = require('express');
const commentRouterPostGet = express.Router({ mergeParams: true })
const commentRouterPutDelete = express.Router({ mergeParams: true })

const commentController = require('../controllers/commentController');

const { comment_validator } = require('../middleware/validation');

commentRouterPostGet.get("/", commentController.getComments);
commentRouterPostGet.post("/", comment_validator, commentController.postComment);
commentRouterPutDelete.put("/", comment_validator, commentController.updateCommentById);
commentRouterPutDelete.delete("/", commentController.deleteCommentById);

module.exports = [commentRouterPostGet, commentRouterPutDelete]