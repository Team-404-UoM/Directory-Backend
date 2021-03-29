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

    //Forum.aggregate([{ "$project": { "matchedIndex": { "$indexOfArray": ["$reply", { "_id": req.params.id }] } } }]).then((res) => console.log()).catch((err) => console.log(err))

    const replybody = req.query.name

    //Forum.findOne({ "_id": req.params.id }).then((result) => {

    Forum.findOneAndUpdate({ "_id": req.params.id }, { $pull: { reply: { _id: replybody } } }).then(result => {
            res.send('reply deleted');

        })
        .catch(err => res.send(err))
})

router.delete('/remove/:id', (req, res) => {
    const { replyindex } = req.body;
    Forum.findOne({ "_id": req.params.id }).then((result) => {
        //let newReply = replyindex;
        Forum.reply.splice(replyindex, 1),
            res.send('reply delete')
    })

    /* Forum.deleteOne({ "body": req.params.id })
        .then(results => res.send('Event Deleted'))
        .catch(err => console.log(err)) */
})


router.get('/', (req, res, next) => {
    console.log('Get Request in place');
    res.json({ message: 'It works' });
});

module.exports = router;