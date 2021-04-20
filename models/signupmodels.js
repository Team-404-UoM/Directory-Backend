const mongoose = require('mongoose')
    //const Schema = mongoose.Schema;

const signUpTemplate = new mongoose.Schema({
    firstName: {
        type: String,
        required: false
    },
    firebaseUserId: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false,
    },
    faculty: {
        type: String,
        required: false
    },
    Batch: {
        type: String,
        required: false
    },

    gender: {
        type: String

    },
    department: {
        type: String

    },
    contactNumber: {
        type: Number
    },
    status: {
        type: String
    },
    dob: {
        type: Date
    },
    workingPlace: {
        type: [String]
    },
    position: {
        type: [String]
    },
    experience: {
        type: [String]
    },
    education: {
        type: [String]
    },
    socialLinkFB: {
        type: String
    },
    socialLinkTwitter: {
        type: String
    },
    socialLinkInsta: {
        type: String
    },
    socialLinkLinkedin: {
        type: String
    },
    photo: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

//module.exports = mongoose.model('pastStudents', signUpTemplate);
const user = mongoose.model('pastStudents', signUpTemplate);
module.exports = user;