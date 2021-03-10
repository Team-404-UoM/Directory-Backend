const express = require('express');
const Blog = require('../models/blog');
const HttpError = require('../models/httperror');
const blogcontrollrs = require('../controllers/blogcontroller');
const router = express.Router();
//const multer = require("multer");



/* const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, ".../Frontend/src/Blog/images/")
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const upload = multer({ storage: storage });
 */


router.get('/Bloginterface', blogcontrollrs.getBlog);

router.get('/:id', blogcontrollrs.getBlogById);

router.post('/', blogcontrollrs.createBlog);

router.patch('/:id', blogcontrollrs.updateBlog);

router.delete('/:id', blogcontrollrs.deleteBlog);

router.patch('/like/:id', blogcontrollrs.increaselike);

router.patch('/unlike/:id', blogcontrollrs.decreaselike);

router.patch('/dislike/:id', blogcontrollrs.increasedislike);

router.patch('/disunlike/:id', blogcontrollrs.decreasedislike);

router.patch('/comment/:id', blogcontrollrs.comment);


router.put('/updateviews/:id', (req, res) => {
    Blog.findOne({ "_id": req.params.id }).then((result) => {
        let currentviews = result.views;
        let newviews = currentviews + 1;
        Blog.updateOne({ "_id": req.params.id }, { $set: { views: newviews } }).then(result => {
            res.send('views update');
        })
    })
})

router.delete('/comment/:id', (req, res) => {
    const commentbody = req.query.name
    Blog.findOneAndUpdate({ "_id": req.params.id }, { $pull: { comments: { body: commentbody } } }).then(result => {
            res.send('comment deleted');
        })
        .catch(err => res.send(err))
})


router.get('/', (req, res, next) => {
    console.log('Get Request in place');
    res.json({ message: 'It works' });
});

module.exports = router;