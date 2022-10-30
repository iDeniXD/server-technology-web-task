const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true },
    last_name: {type: String, required: true },
    gender: {type: String, enum:['M','F'] },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
    approved_by: { type: this, required: false},
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'role', required: true }
});

module.exports = mongoose.model("user", userSchema);