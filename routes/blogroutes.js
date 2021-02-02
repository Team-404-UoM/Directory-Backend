const express = require('express');
const Blog = require('../models/blog');
const HttpError = require('../models/httperror');
const blogcontrollrs = require('../controllers/blogcontroller');
const router = express.Router();
const multer = require("multer");


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, ".../Frontend/src/Blog/images/")
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const upload = multer({ storage: storage });



router.get('/Bloginterface', blogcontrollrs.getBlog);

router.get('/:id', blogcontrollrs.getBlogById);

router.post('/', upload.single('blogImage'), blogcontrollrs.createBlog);

router.patch('/:id', blogcontrollrs.updateBlog);

router.delete('/:id', blogcontrollrs.deleteBlog);

router.patch('/like/:id', blogcontrollrs.increaselike);

router.patch('/unlike/:id', blogcontrollrs.decreaselike);





router.get('/', (req, res, next) => {
    console.log('Get Request in place');
    res.json({ message: 'It works' });
});

module.exports = router;