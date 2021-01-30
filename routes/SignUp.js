const express = require('express')
const router = express.Router()
const signUpTemplateCopy = require('../models/signupmodels')
const bcrypt = require('bcrypt')

router.post('/signup', async(request, response) => {
    // https://firebase.google.com/docs/auth/admin/manage-users#create_a_user

    const saltPassword = await bcrypt.genSalt(10)
    const securePassword = await bcrypt.hash(request.body.password, saltPassword)

    const signedUpUser = new signUpTemplateCopy({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        faculty: request.body.faculty,
        gender: request.body.gender,
        email: request.body.email,
        password: securePassword
    })
    try{
        const data = await signedUpUser.save();
        response.json(data);
    }catch(error) {
        response.json(error)
    }    
})


module.exports = router