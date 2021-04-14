const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notification = new Schema({
    NotificationType: {
        type: String,
    },
    ForumQuestion: {
        type: String
    },
    UserId: {
        type: String
    },
    Date: {
        type: Date
    }
});
const Notification = mongoose.model('Notification', notification);
module.exports = Notification;