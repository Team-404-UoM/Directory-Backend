const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notification = new Schema({
    QuestionType: {
        type: String,
    },
    UserId: {
        type: String
    },
});
const Notification = mongoose.model('Notification', notification);
module.exports = Notification;