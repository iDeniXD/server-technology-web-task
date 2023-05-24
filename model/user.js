const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true, maxLength: 100 },
    last_name: {type: String, required: true, maxLength: 150 },
    email: { type: String, unique: true, required: true, maxLength: 250 },
    password: { type: String, required: true },
    role: { type: String, required: false, default: 'employee', enum: ['admin', 'head', 'employee'] },
    accepted_by: { type: this, required: false},
    status: {type: String, enum: ['rejected', 'pending', 'accepted'], default: 'pending'},

    // not saved in DB
    access_token: { type: String },
    accepted: { type: Boolean }
});

module.exports = mongoose.model("user", userSchema);