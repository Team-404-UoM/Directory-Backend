const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const paypal = require('paypal-rest-sdk');
const path = require("path");
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

require('../models/Event');
const Events = mongoose.model('events');

const mongoURI = ' mongodb+srv://nirasha:1CVOHXmNP8iqpaVt@cluster0.bycqq.mongodb.net/WebMemberDirectory?ssl=true&ssl_cert_reqs=CERT_NONE';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('eventthumbnails');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'eventthumbnails'
        };
        resolve(fileInfo);
    });
  }
});

const upload = multer({ storage });

//Paypal config
paypal.configure({
    'mode': 'sandbox', //set method as sandbox 
    'client_id': 'AaTHqF1m-XImn1QyWi3OSoaEWidzX--UZ0p-UdNkwVRs57Y3bsma4Pz9-q6YGkQFRiAtJ-efxNddnf3k',
    'client_secret': 'EEf-8CaKkAil_O9sK7B6fWstxw6v_zdtbREQ_3H5KWzbSJ201kIuO-ZE_beBZIHhC_Vv6L1PLp75ewDD'
});

//Ticket schema
const TicketsSchema = mongoose.Schema({
    current: {
        type: String,
        // required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    referance: {
        type: Number,
        required: true
    },
    ticket_type: {
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

//Get event data
router.get('/', (req,res) =>{
    Events.find().then(result =>{
        res.json(result);
    }).catch(err =>{
        console.log(err);
    });
});

const myDB = mongoose.connection.useDb('WebMemberDirectory');

router.get('/getUsers', (req,res) =>{
   myDB.collection('users').find({}).toArray((err, result) =>{
    if (err) throw err;
    res.send(result);
  });
});


//Get payemet data collection names
router.get('/payemnt_collections/:id', (req, res) => {
    mongoose.connection.db.collection(`${req.params.id}_pay`)
});

router.get('/eventData', (req,res) => {
    Events.find({},{_id: 1, title: 1, paid: 1}).then(result =>{
        res.send(result)
    })
})

//Get event thumbnail data from DB
router.get('/getThumb', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        res.send(files);
    });
  });

  //Get thumbnail image for selected event
  router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {

      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {

        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });

  //Get payment records
  router.get('/getPayments/:id', (req,res) =>{
    const payemtDB = mongoose.connection.useDb('WebMemberDirectory');
    payemtDB.collection(`${req.params.id}_payments`).find().toArray((err, result) =>{
        if (err) throw err;
        res.send(result);
      })
  })


//Add event
router.post('/add', upload.single("image"), (req,res) =>{

    let arr = req.body.tickets.split(',');

    const new_event = new Events({
        title: req.body.title,
        description: req.body.description,
        attendance: 0,
        image: req.file.originalname,
        date: req.body.date,
        paid: req.body.paid, 
        tickets: arr
    });

    new_event.save()
    .then(result => res.send('New Event Added'))
    .catch(err => console.log(err));
    console.log('event add');
});


//Update event
router.put('/:id', (req,res) =>{
    
    let updated_values = {}

    Events.find({_id: req.params.id}).then(result =>{
        if(req.body.title != result[0].title){
            updated_values.title = req.body.title;
        }
        else if(req.body.description != result[0].description){
            updated_values.description = req.body.description;
        }
        else if(req.body.date != result[0].date){
            updated_values.date = req.body.date;
        }
        else if(req.body.paid != result[0].paid){
            updated_values.paid = req.body.paid;
        }

        Events.updateMany({_id: req.params.id}, {$set: updated_values})
        .then(result => res.send("Event Details Updated"))
        .catch(err => console.log(err));

    }).catch(err =>{
        console.log(err)
    });   
})

//Remove event
router.delete('/remove/:id', (req,res)=>{
    Events.deleteOne({_id: req.params.id})
    .then(results => res.send('Event Deleted'))
    .catch(err => console.log(err))
})


//Get ticket data for selected event
router.get('/tickets/:id', (req,res) => {
    Events.find({_id: req.params.id}, {tickets:1, _id:0}).then(result =>{
        res.json(result);
    }).catch(err =>{
        res.send(err);
    })
})

//Add payment data to DB
router.post('/register/:id', async (req,res) =>{
        let ticket = mongoose.model(`${req.params.id}_payments`, TicketsSchema);

        let ref = Math.floor(Math.random() * 9999) + 1001;
        let nic = req.body.nic
        let nic_num = nic.substring(0, 9)
        let referance_id = parseInt(nic_num) + ref

        const payment = new ticket({
            current: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            ticket_type: req.body.ticket_type,
            referance: referance_id,
            qty: req.body.qty,
            nic: req.body.nic,
            price: req.body.price
        });

        console.log(payment);

        payment.save().then(result => {
            res.json(result);
            Events.findOne({_id: req.params.id}).then((result) => {
                let cattend = result.attendance;
                let newattend = cattend + parseFloat(req.body.qty);
                console.log(newattend);
                Events.updateOne({"_id": req.params.id}, { $set: {attendance: newattend}}).then(result =>{
                    console.log('attendance update');
                })
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'nirashawimalasooriya@gmail.com',
                        pass: 'nirasha123'
                    }
                });
    
                let mailOptions = {
                    from: 'nirashawimalasooriya@gmail.com',
                    to: req.body.email,
                    subject: 'Booking Confirmed - Unviversity Of Moratuwa Event Protal',
                    html: `<h2>Hello!</h2>
                <p>You were successfully booked <b>${req.body.qty}</b> Tickets for ${result.title}</p>
                <br>
                <h3>Ticket Details</h3>
                <p><b>Total Payment :</b> ${req.body.price} LKR</p>
                <p><b>Number Of Tickets :</b> ${req.body.qty} </p>
                <p><b>Ticket Type :</b> ${req.body.ticket_type} </p>
                <p><b>Reference Number :</b> ${referance_id} </p>
                <p><b>Booking Date :</b> ${result.date} </p>
                <br>
                <p>Please come to event 15 miniutes before starting time, Make sure to keep this email with you. Enjoy!</p>
                <br>
                <p>Thank You,</p>
                <p>Regards,</p>
                <p>Organizing Team</p> `
                };
    
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            })

            

        }).catch(err => console.log(err));
    
});

//Send event postpone alerts 
router.post('/sendPPAlerts/:id', (req,res) => {

    let ticket = mongoose.model(`${req.params.id}_payments`, TicketsSchema);

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'nirashawimalasooriya@gmail.com',
            pass: 'nirasha123'
        }
    });

    console.log(req.body);

    Events.findOne({_id: req.params.id}).then(resulte => {
    ticket.find().then(result =>{
        for(let i =0; i < result.length; i++){
        let mailOptions = {
            from: 'nirashawimalasooriya@gmail.com',
            to: result[i].email,
            subject: `Event ${resulte.title} Postponed - Unviversity Of Moratuwa Event Protal`,
            html: `<h2>Hello!</h2>
        <br>
        <p>${req.body.datas}</p>
        <br>
        <p>Thank You,</p>
        <p>Regards,</p>
        <p>Organizing Team</p> `
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    Events.updateOne({_id: req.params.id}, { $set: {postpone: true}}).then(results => {
        res.send(true);
    })
    })
})
})

//Send Reminder alerts
router.post('/sendReminderAlerts/:id', (req,res) => {

    let ticket = mongoose.model(`${req.params.id}_payments`, TicketsSchema);

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'nirashawimalasooriya@gmail.com',
            pass: 'nirasha123'
        }
    });

    Events.findOne({_id: req.params.id}).then(resulte => {
    ticket.find().then(result =>{
        for(let i =0; i < result.length; i++){
        let mailOptions = {
            from: 'nirashawimalasooriya@gmail.com',
            to: result[i].email,
            subject: `Event Reminder For ${resulte.title} - Unviversity Of Moratuwa Event Protal`,
            html: `<h2>Hello!</h2>
        <br>
        <p>${req.body.datas}</p>
        <br>
        <p>Thank You,</p>
        <p>Regards,</p>
        <p>Organizing Team</p> `
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    res.send(true);
    })
})
})

//Set event state to potpone
router.put('/postponeEvent/:id', (req,res) => {
    console.log(req.params.id);
    Events.updateOne({_id: req.params.id}, { $set: {postpone: true}}).then(results => {
        res.send(results);
    })
})

//Set event state to live
router.put('/resumeEvent/:id', (req,res) => {
    console.log(req.params.id);
    Events.updateOne({_id: req.params.id}, { $set: {postpone: false}}).then(results => {
        res.send(results);
    })
})

router.post('/sendEventAlerts/:id', (req,res) => {

    let ticket = mongoose.model(`${req.params.id}_payments`, TicketsSchema);

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'nirashawimalasooriya@gmail.com',
            pass: 'nirasha123'
        }
    });

    console.log(req.body);

    Events.findOne({_id: req.params.id}).then(resulte => {
    ticket.find().then(result =>{
        for(let i =0; i < result.length; i++){
        let mailOptions = {
            from: 'nirashawimalasooriya@gmail.com',
            to: result[i].email,
            subject: `Event ${resulte.title} Postponed - Unviversity Of Moratuwa Event Protal`,
            html: `<h2>Hello!</h2>
        <br>
        <p>${req.body.datas}</p>
        <br>
        <p>Thank You,</p>
        <p>Regards,</p>
        <p>Organizing Team</p> `
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    Events.updateOne({_id: req.params.id}, { $set: {postpone: true}}).then(results => {
        res.send(true);
    })
    })
})
})



//Update attendance for event
router.put('/updateAttendance/:id', (req,res)=>{ 
    Events.findOne({_id: req.params.id}).then((result) => {
        let cattend = result.attendance;
        let newattend = cattend + 1;
        Events.updateOne({"_id": req.params.id}, { $set: {attendance: newattend}}).then(result =>{
            res.send('attendance update');
        })
    })
})

//Update event
router.put('/updateEvent/:id', (req,res)=>{ 
    Events.updateOne({"_id": req.params.id}, { $set: {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        paid: req.body.paid, 
    }}
    ).then(result =>{
        res.send('event update');
    })

})

//Delete payemet collection
router.post('/deletepd/:id', (req,res)=>{
    mongoose.connection.db.dropCollection(`${req.params.id}_payments`).then(out =>{
        res.send('payement details deleted');
    })
})

//Reomove event
router.delete('/removeEvent/:id', (req,res) =>{
    Events.deleteOne({_id: req.params.id}).then((result) => {
        gfs.remove({ filename: req.body.filename, root: 'eventthumbnails' }, (err, gridStore) => {
            if (err) {
              return res.status(404).json({ err: err });
            }
        
            res.send(result);
          });
    })
})

module.exports = router;