const express = require('express');
const Profile=require('../models/signupmodels')

const router = express.Router();


router.get('/home',(req,res)=>{
    Profile.find().then(result=>{
        res.send(result)
    }).catch(err=>{
        console.log(err);
    })
})
module.exports = router;