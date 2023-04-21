const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now, required: true },
    content: { type: String, maxLength: 2000, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    parent_comment: { type: this, required: false },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'question', required: true }
});

module.exports = mongoose.model("Comment", commentSchema);