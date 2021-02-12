const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forumSchema = new Schema({
    message: {
        type: String,
        //required: true
    },
    reply: {
        type: [String]

    }

}, { timestamps: true });
const Forum = mongoose.model('Forum', forumSchema);
module.exports = Forum;