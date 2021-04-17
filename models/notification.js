const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notification = new Schema({
    NotificationType: {
        type: String,
    },
    Title: {
        type: String
    },
    Message: {
        type: String
    },
    OwnerUserId: {
        type: String
    },
    OwnerfirebaseId: {
        type: String
    },
    Date: {
        type: Date
    }
});
const Notification = mongoose.model('Notification', notification);
module.exports = Notification;