const express = require('express')
const router = express.Router()
const signUpTemplateCopy = require('../models/signupmodels')
const bcrypt = require('bcrypt');
const firebaseAuth = require('../config/firebase_config');
const HttpError = require('../models/httperror');


const ACADEMIC = "ACADEMIC";
const PAST_STUDENT = "PAST_STUDENT";
const ADMIN = "ADMIN";

router.post('/signup', async(request, response) => {
    const userType = request.query.type;
    if (userType !== ACADEMIC && userType !== PAST_STUDENT && userType !== ADMIN) {
        console.error(userType);
        response.status(400).send("Type is incorret");
        return;
    }

    // https://firebase.google.com/docs/auth/admin/manage-users#create_a_user
    const email = request.body.email;
    const password = request.body.password;
    const userDetails = await firebaseAuth.createUser({ email: email, password: password, emailVerified: false });

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

    try {
        const data = await signedUpUser.save();
        const customToken = await firebaseAuth.createCustomToken(firebaseUserId);
        response.status(200).send(customToken);
    } catch (error) {
        await firebaseAuth.deleteUser(firebaseUserId);
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

router.get('/users', async(request, response) => {
    const firebaseUserId = request.user.uid;
    const user = await signUpTemplateCopy.findOne({ firebaseUserId });
    response.status(200).send(user);
})

router.put('/users', async (req, res) => {
    const socialLinkFB = req.body.socialLinkFB;

    const firebaseUserId = req.user.uid;
    await signUpTemplateCopy.update({ firebaseUserId}, {
        $set: {socialLinkFB, 
        // insert updated fields
        }
    });

});

router.get('/user/:id', (req, res) => {
    signUpTemplateCopy.findOne({ firebaseUserId: req.params.id })
        .then(results => res.send(results))
        .catch(err => console.log(err))
})

/* router.get('/user/:id', async(req, res, next) => {
    const userId = req.params.id;
    let user;
    try {
        user = await signUpTemplateCopy.findById({ firebaseUserId: userId });
    } catch (err) {
        const error = new HttpError(
            'Someting went wrong,could not find a place', 500
        );
        return next(error);


    }
    if (!user) {
        const error = new HttpError('Could not find a place for the provided id', 404);

        return next(error);
    }
    res.json({ user: user.toObject({ getters: true }) });
}) */



module.exports = router