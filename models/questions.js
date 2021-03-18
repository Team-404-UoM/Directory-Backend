const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    possible_answers: {
        type: [],
        required: true
    },
    correct_answer: {
        type: String,
        required: true
    }
}, { timestamps: true });
const Question = mongoose.model('Questions', questionSchema);
module.exports = Question;