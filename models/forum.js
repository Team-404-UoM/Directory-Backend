const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forumSchema = new Schema({
    message: {
        type: String,
        //required: true
    },
    reply: [{
        body: String,
        date: Date,
        id: String,
        firebaseId: String,
        userId: String,
        firstname: String,
        lastname: String,
        userimage: String

    }],
    privacytype: {
        type: String
    },
    faculty: {
        type: String
    },
    firebaseId: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    userId: {
        type: String
    },
    userType: {
        type: String
    },
    userimage: {
        type: String
    }
}, { timestamps: true });
const Forum = mongoose.model('Forum', forumSchema);
module.exports = Forum;