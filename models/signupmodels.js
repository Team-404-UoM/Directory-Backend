const mongoose = require('mongoose')

const signUpTemplate = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:true
    },

    faculty:{
        type:[],
        required:true
    },
    Batch:{
        type:String,
        required:true
    },

    gender:{
        type: [],
        required:true
    },
    

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    date:{
        type:Date,
        default:Date.now
    },
})

module.exports = mongoose.model('pastStudents', signUpTemplate)