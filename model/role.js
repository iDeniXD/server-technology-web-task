const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    role: { type: String, default: 'Employee', unique: true, required: true } // TODO: add max 30
});

module.exports = mongoose.model("role", roleSchema);