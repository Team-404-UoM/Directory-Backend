const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    firebaseId: {
        type: String,

    },
    body: {
        type: String,
        required: true
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
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
    coverImage: {
        type: String,

    },
    views: {
        type: Number,
        default: 0
    },
    comments: [{
        body: String,
        date: Date,
        id: String,
        userId: String,
        firebaseId: String,
        firstname: String,
        lastname: String

    }],


}, { timestamps: true });
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;