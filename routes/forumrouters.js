const express = require('express');
const HttpError = require('../models/httperror');
const forumcontrollrs = require('../controllers/forumcontroller');
const router = express.Router();


router.get('/home', forumcontrollrs.getForum);

router.get('/:id', forumcontrollrs.getForumById);

router.post('/', forumcontrollrs.createForum);

router.patch('/:id', forumcontrollrs.updateForum);

router.delete('/:id', forumcontrollrs.deleteForum);





router.get('/', (req, res, next) => {
    console.log('Get Request in place');
    res.json({ message: 'It works' });
});

module.exports = router;