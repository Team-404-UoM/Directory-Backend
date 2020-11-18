const express = require('express');
const HttpError = require('../models/httperror');
const blogcontrollrs = require('../controllers/blogcontroller');
const router = express.Router();



router.get('/Bloginterface', blogcontrollrs.getBlog);

router.get('/:id', blogcontrollrs.getBlogById);

router.post('/', blogcontrollrs.createBlog);

router.patch('/:id', blogcontrollrs.updateBlog);

router.delete('/:id', blogcontrollrs.deleteBlog);

router.patch('/like/:id', blogcontrollrs.increaselike);

router.patch('/unlike/:id', blogcontrollrs.decreaselike);





router.get('/', (req, res, next) => {
    console.log('Get Request in place');
    res.json({ message: 'It works' });
});

module.exports = router;