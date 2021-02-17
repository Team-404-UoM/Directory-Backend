const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//import schema
require('../models/Jobs');
const Jobs = mongoose.model('jobs');

//Add job
router.post('/add', (req,res) =>{
    const new_job = new Jobs({
        title: req.body.title,
        description: req.body.description,
        requirements: req.body.requirements,
        closingDate: req.body.closingDate,
    });

    new_job.save()
    .then(result => res.send('New Job Added'))
    .catch(err => console.log(err));
    console.log('event add');
});

//Update job
router.put('/updateJob/:id', (req,res)=>{ 
    Jobs.updateOne({"_id": req.params.id}, { $set: {
        title: req.body.title,
        description: req.body.description,
        closingDate: req.body.closingDate,
    }}
    ).then(result =>{
        res.send('Job update');
    })

})

//Delete job
router.delete('/removeJob/:id', (req,res) =>{
    Jobs.deleteOne({_id: req.params.id}).then((result) => {
        res.send(result);
    })
})

//Get Jobs
router.get('/', (req,res) =>{
    Jobs.find().then(result =>{
        res.json(result);
    }).catch(err =>{
        console.log(err);
    });
});



module.exports = router;