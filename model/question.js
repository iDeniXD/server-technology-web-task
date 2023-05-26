const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now, required: true },
    topic: { type: String, minLength: 3, maxLength: 50, required: true},
    content: { type: String, minLength: 3, maxLength: 2000, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
});

module.exports = mongoose.model("question", questionSchema);