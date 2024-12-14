const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    attachmentFiles: {
        type: Array,
        default: []
    },
    created: {
        type: Date,
        default: Date.now
    },
});

const Board = mongoose.model("board", boardSchema);
module.exports = Board;
