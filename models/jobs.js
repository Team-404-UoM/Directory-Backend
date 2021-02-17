const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: Array
    },
    closingDate: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('jobs', JobSchema)