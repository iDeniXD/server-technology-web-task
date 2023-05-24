const mongoose = require("mongoose");

const releaseSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    date: { type: Date, default: Date.now, required: true },
    version: { 
        type: String, 
        minLength: 1,
        maxLength: 10, 
        match: [
            /^(\d+\.?)+\d+$/,
            '{VALUE} is not a valid version format. The correct format is digits and dots (e.g., 1.10.20)'
        ], 
        required: true,
        unique: true
    },
    description: { type: String, maxLength: 200, required: false },
    documentation: {type: mongoose.Schema.Types.ObjectId, ref: 'documentation', required: false},
    changelog: { type: String, minLength: 1, maxLength: 10000, required: true },
    images: [String],
    file: {type: String, required: true}
});

module.exports = mongoose.model("release", releaseSchema);