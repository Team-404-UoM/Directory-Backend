const express = require('express')
const router = express.Router()
const signUpTemplateCopy = require('../models/signupmodels')
const bcrypt = require('bcrypt');
const firebaseAuth = require('../config/firebase_config');
const Signup=require('../models/signupmodels');

const ACADEMIC = "ACADEMIC";
const PAST_STUDENT = "PAST_STUDENT";

router.post('/signup', async(request, response) => {
    const userType = request.query.type;
    if(userType !== ACADEMIC && userType !== PAST_STUDENT ){
        console.error(userType);
        response.status(400).send("Type is incorret");
        return;
    }

    // https://firebase.google.com/docs/auth/admin/manage-users#create_a_user
    const email = request.body.email;
    const password = request.body.password;
    const userDetails = await firebaseAuth.createUser({email: email, password: password, emailVerified: false});

    // const saltPassword = await bcrypt.genSalt(10)
    // const securePassword = await bcrypt.hash(request.body.password, saltPassword)
    const firebaseUserId = userDetails.uid;
    const signedUpUser = new signUpTemplateCopy({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        faculty: request.body.faculty,
        Gender: request.body.gender,
        firebaseUserId: firebaseUserId,
        Batch: request.body.batch,
        Department: request.body.department,
        type: userType
        // email: request.body.email,
        // password: securePassword
    });

    try{
        const data = await signedUpUser.save();
        const customToken =  await firebaseAuth.createCustomToken(firebaseUserId);
        response.status(200).send(customToken);
    }catch(error) {
        console.error(error);
        response.json(error)
    }    
})

router.post('/users', async(request, response) => {
    const firebaseUserId = request.user.uid;
    //search the correspoding user in the db
    // signUpTemplateCopy.where()
    // response.send()
}) 

module.exports = router