const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    role: { type: String, default: 'Employee', unique: true, required: true }
});

module.exports = mongoose.model("role", roleSchema);