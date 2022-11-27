const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true }, // TODO: add max 50
    last_name: {type: String, required: true }, // TODO: add max 70
    email: { type: String, unique: true, required: true }, // TODO: add max 250
    password: { type: String, required: true },
    access_token: { type: String }, // TODO: consider getting rid of this bs
    approved_by: { type: this, required: false}, // TODO: is this even working?
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'role' }
});

module.exports = mongoose.model("user", userSchema);