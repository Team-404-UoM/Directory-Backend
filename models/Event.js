const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    attendance: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: false
    },
    paid: {
        type: Boolean,
        required: true
    },
    tickets: {
        type: []

    },


})

mongoose.model('events', EventSchema)