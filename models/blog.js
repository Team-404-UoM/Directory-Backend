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
        default: 0
    },
    likecolor: {
        type: String,
        default: "black"
    },
    likestatus: {

        type: Boolean,
        default: false
    },
    dislike: {
        type: Number,
        default: 0
    },
    dislikecolor: {
        type: String,
        default: "black"
    },
    dislikestatus: {

        type: Boolean,
        default: false
    },
    categorie: {
        type: String,
    },
    blogImage: {
        type: String,

    },
    views: {
        type: Number,
        default: 0
    }


}, { timestamps: true });
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;