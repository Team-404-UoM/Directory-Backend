const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

//const Blog = require('./models/blog');
const blogRouters = require('./routes/blogroutes');
const forumRouters = require('./routes/forumrouters');
const bloguploaderRouters = require('./routes/bloguploaderroutes');
const signUp = require('./routes/SignUp');

//importing event,gallery,jobs routes
const events = require('./routes/events');
const gallery = require('./routes/gallery');
const jobs = require('./routes/jobs');

const questions = require('./routes/questionroutes');
const fileupload = require('./routes/fileupload');
const profile = require('./routes/directory');
const firebaseAuth = require('./config/firebase_config');
const HttpError = require('./models/httperror');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(bodyparser.json());

//Configure dotenv
require("dotenv").config();


app.use('/uploads', express.static('uploads'));

// Check access token
app.use(async function(req, res, next) {
    const accessToken = req.headers.authorization;
    if (accessToken) {
        const accessTokenNoBearer = accessToken.replace('Bearer ', '');
        const decodedToken = await firebaseAuth.verifyIdToken(accessTokenNoBearer);

        req.user = decodedToken;
    }
    next();
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Acsess-Control-Allow-Headers', 'Origin,X-Requested-with,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/Blog', blogRouters);
app.use('/Forum', forumRouters);
app.use('/Bloguploader', bloguploaderRouters);
app.use(signUp);
app.use(questions);
app.use(profile);


app.use('/file', fileupload);

//Add initial route for testing
app.use('/events', events);
app.use('/gallery', gallery);
app.use('/jobs', jobs);

app.use('/images', express.static('images'))

app.use(cors());


app.use((req, res, next) => {
    const error = new HttpError('Could not find this routee.', 404);
    throw error;
});

app.use((req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!' });
});




//const mongodb = 'mongodb+srv://nirasha:1CVOHXmNP8iqpaVt@cluster0.bycqq.mongodb.net/WebMemberDirectory?ssl=true&ssl_cert_reqs=CERT_NONE'
//mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
// .then((result) => console.log('connected to db'))
// .catch((err) => console.log(err));





//app.listen(4000);

//Start server
app.listen(process.env.PORT, () => {

    console.log(`server started at ${process.env.PORT}`);

    //Connect to the database
    mongoose.Promise = global.Promise;
    mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err, db) => {
            console.log("MongoDB Connected Successfully!!")

        })
})

//backend check commit
//secondcommit
