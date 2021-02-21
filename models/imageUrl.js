const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageURL = new Schema({
    url: {
        type: String,
        required: true
    }
});
const ImageURL = mongoose.model('ImageURL', imageURL);
module.exports = ImageURL;