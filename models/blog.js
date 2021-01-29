const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    like: {
        type: Number,
    },
    color: {
        type: String,
        default: "outline-info"
    },
    likestatus: {

        type: Boolean,
        default: false
    },
    blogImage: {
        type: String,

    }


}, { timestamps: true });
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;