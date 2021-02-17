const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const path = require("path");
const router = express.Router();

require('../models/Event');
const Events = mongoose.model('events');

const TicketsSchema = mongoose.Schema({
    current: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    card: {
        type: String,
        required: true
    },
    qty: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

})

//retrieve event data
router.get('/', (req, res) => {
    Events.find().then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
    });
});

//add new event
router.post('/', (req, res) => {
    const new_event = new Events({
        title: req.body.title,
        description: req.body.description,
        attendance: req.body.attendance,
        image: req.body.image,
        date: req.body.date,
        paid: req.body.paid,
        tickets: req.body.tickets
    });

    new_event.save()
        .then(result => res.send('New Event Added'))
        .catch(err => console.log(err));

});
//get ticket details
router.get('/tickets/:id', (req, res) => {
    Events.find({ "_id": req.params.id }, { tickets: 1, _id: 0 }).then(result => {
        res.json(result);
    }).catch(err => {
        res.send(err);
    })
})

//register for event
router.post('/register/:id', async(req, res) => {
    let ticket = mongoose.model(`${req.params.id}_payments`, TicketsSchema);
    const salt = await bcrypt.genSalt(10)
    let hashedCard = await bcrypt.hash(req.body.card, salt)
    const payment = new ticket({
        current: req.body.current,
        phone: req.body.phone,
        email: req.body.email,
        card: hashedCard,
        qty: req.body.qty,
        nic: req.body.nic,
        price: req.body.price
    });

    payment.save().then(result => {
        res.json(result);
        Events.findOne({ "_id": req.params.id }).then((result) => {
            let cattend = result.attendance;
            let newattend = cattend + parseFloat(req.body.qty);
            console.log(newattend);
            Events.updateOne({ "_id": req.params.id }, { $set: { attendance: newattend } }).then(result => {
                console.log('attendance update');
            })
        })
    }).catch(err => console.log(err));

})

router.put('/updateAttendance/:id', (req, res) => {
    Events.findOne({ "_id": req.params.id }).then((result) => {
        let cattend = result.attendance;
        let newattend = cattend + 1;
        Events.updateOne({ "_id": req.params.id }, { $set: { attendance: newattend } }).then(result => {
            res.send('attendance update');
        })
    })
})

router.post('/deletepd/:id', (req, res) => {
    mongoose.connection.db.dropCollection(`${req.params.id}_payments`).then(out => {
        res.send('payement details deleted');
    })
})

module.exports = router;


//test commit