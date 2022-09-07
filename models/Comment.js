const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    object: { type: String, required: true},
    user: { type: String, required: true},
    content: { type: String, required: true}
}, { timestamps: true})

module.exports = mongoose.model("Comment", CommentSchema);