const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
//const Blog = require('./models/blog');
const blogRouters = require('./routes/blogroutes');
const forumRouters = require('./routes/forumrouters');
const bloguploaderRouters = require('./routes/bloguploaderroutes');
const signUp = require('./routes/SignUp');
const event = require('./routes/events');
const HttpError = require('./models/httperror');
const cors = require('cors');

const app = express();

app.use(bodyparser.json());

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
app.use('/Event', event);
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






const mongodb = 'mongodb+srv://nirasha:1CVOHXmNP8iqpaVt@cluster0.bycqq.mongodb.net/WebMemberDirectory?ssl=true&ssl_cert_reqs=CERT_NONE'
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));





app.listen(4000);
//backend github test commit