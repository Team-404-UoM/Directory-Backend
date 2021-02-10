const express = require('express');
const HttpError = require('../models/httperror');
const bloguploadercontrollrs = require('../controllers/bloguploadercontroller');
const router = express.Router();



router.get('/', bloguploadercontrollrs.getBlog);

router.get('/:id', bloguploadercontrollrs.getBlogById);

router.post('/', bloguploadercontrollrs.createBlog);

router.patch('/:id', bloguploadercontrollrs.updateBlog);

router.delete('/:id', bloguploadercontrollrs.deleteBlog);

router.patch('/like/:id', bloguploadercontrollrs.increaselike);

router.patch('/unlike/:id', bloguploadercontrollrs.decreaselike);

router.patch('/dislike/:id', bloguploadercontrollrs.increasedislike);

router.patch('/disunlike/:id', bloguploadercontrollrs.decreasedislike);




router.get('/', (req, res, next) => {
    console.log('Get Request in place');
    res.json({ message: 'It works' });
});

module.exports = router;