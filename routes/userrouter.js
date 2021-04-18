const express = require('express');
const HttpError = require('../models/httperror');
const usercontroller = require('../controllers/user');
const router = express.Router();

router.get('/:id', usercontroller.getUserId);







module.exports = router;