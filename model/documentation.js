const mongoose = require("mongoose");

const documentationSchema = new mongoose.Schema({
    version: { 
        type: String, 
        minLength: 1,
        maxLength: 10, 
        match: [
            /^(\d+\.?)+(x|\d)+$/,
            '{VALUE} is not a valid version format. The correct format is digits and dots (e.g., 1.10.20)'
        ], 
        required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    date: { type: Date, default: Date.now, required: true },
    text: { type: String, minLength: 1, maxLength: 50000, required: true },
    images: [String],
});

module.exports = mongoose.model("documentation", documentationSchema);