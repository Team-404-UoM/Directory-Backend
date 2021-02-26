const express = require('express');
const HttpError = require('../models/httperror');
const forumcontrollrs = require('../controllers/forumcontroller');
const router = express.Router();
const Forum = require('../models/forum');


router.get('/home', forumcontrollrs.getForum);

router.get('/:id', forumcontrollrs.getForumById);

router.post('/', forumcontrollrs.createForum);

router.patch('/:id', forumcontrollrs.updateForum);

router.delete('/:id', forumcontrollrs.deleteForum);


router.put('/reply/:id', (req, res) => {
    const reply = {
        body: req.body.body,
        date: req.body.date
    }

    Forum.findOne({ "_id": req.params.id }).then((result) => {
        //let newReply = reply;
        Forum.updateOne({ "_id": req.params.id }, { $push: { reply: reply } }).then(result => {
            res.send('reply update');
        })
    })
})

router.delete('/reply/:id', (req, res) => {
    const { reply } = req.body;
    Forum.findOne({ "_id": req.params.id }).then((result) => {
        let newReply = reply;
        Forum.updateOne({ "_id": req.params.id }, { $pull: { reply: newReply } }).then(result => {
            res.send('reply deleted');
        })
    })
})

router.delete('/remove/:id', (req, res) => {
    Forum.deleteOne({ "body": req.params.id })
        .then(results => res.send('Event Deleted'))
        .catch(err => console.log(err))
})


router.get('/', (req, res, next) => {
    console.log('Get Request in place');
    res.json({ message: 'It works' });
});

module.exports = router;