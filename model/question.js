const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now, required: true },
    topic: { type: String, maxLength: 50, minLength: 3, required: true}, // max 50
    content: { type: String, maxLength: 2000, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
});

module.exports = mongoose.model("question", questionSchema);