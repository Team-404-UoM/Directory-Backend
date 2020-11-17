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
    }

}, { timestamps: true });
const Bloguploader = mongoose.model('Bloguploader', bloguploaderSchema);
module.exports = Bloguploader;