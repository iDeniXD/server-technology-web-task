const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema({
    number: { type: String, unique: true, required: true },
    link: { type: String, maxLength: 300, required: true },
    file_documentation: { type: String, maxLength: 100, default: null, required: false },
    file_patch_notes: { type: String, maxLength: 100, default: null, required: false },
    file_changelog: { type: String, maxLength: 100, default: null, required: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
});

module.exports = mongoose.model("version", versionSchema);