const mongoose = require('mongoose')

const signUpTemplate = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    firebaseUserId:{
        type: String,
        required: true
    },
    lastName:{
        type:String,
        required:true
    },
    type:{
        type: String,
        required: true,
    },
    faculty:{
        type:String,
        required:true
    },
    Batch:{
        type:String,
        required: false 
    },

    gender:{
        type:String,
        required:true
    },
     department:{
        type:String,
        required:true
    },
  /*   contactNumber:{
        type:Number
    },
    status:{
        type:String
    },
    dob:{
        type:Date
    },
    workingPlace:{
        type:[String]
    },position:{
        type:[String]    
    },
    experience:{
        type:[String]    
    },
    education:{
        type:[String]    
    },
    socialLinkFB:{
        type:String   
    },
    socialLinkTwitter:{
        type:String   
    },socialLinkInsta:{
        type:String   
    },
    socialLinkLinkedin:{
        type:String   
    },*/
    

    // email:{
    //     type:String,
    //     required:true
    // },

    // password:{
    //     type:String,
    //     required:true
    // },

    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('pastStudents', signUpTemplate)