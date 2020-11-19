const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forumSchema = new Schema({
    message: {
        type: String,
        //required: true
    },
    reply: {
        type: []

    }

}, { timestamps: true });
const Forum = mongoose.model('Forum', forumSchema);
module.exports = Forum;