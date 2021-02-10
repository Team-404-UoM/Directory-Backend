const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bloguploaderSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    url: {
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

}, { timestamps: true });
const Bloguploader = mongoose.model('Bloguploader', bloguploaderSchema);
module.exports = Bloguploader;