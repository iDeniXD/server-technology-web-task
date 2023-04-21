const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now, required: true },
    topic: { type: String, maxLength: 50, minLength: 3, required: true}, // max 50
    content: { type: String, maxLength: 2000, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    accepted_comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model("question", questionSchema);