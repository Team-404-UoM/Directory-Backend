const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signUpTemplate = new Schema({
    firstName: {
        type: String,
        required: true
    },
    firebaseUserId: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    faculty: {
        type: String,
        required: true
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
    date: {
        type: Date,
        default: Date.now
    }
})
const Signup = mongoose.model('pastStudents', signUpTemplate)
module.exports = Signup;