const express = require('express');
const HttpError = require('../models/httperror');
const questioncontrollrs = require('../controllers/questioncontroller');
const router = express.Router();




router.get('/questions', questioncontrollrs.getQuestions);

router.post('/questions', questioncontrollrs.submitQuestions);

module.exports = router;