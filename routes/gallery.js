const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const router = express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream')
const fs = require('fs');

const mongoURI = ' mongodb+srv://nirasha:1CVOHXmNP8iqpaVt@cluster0.bycqq.mongodb.net/WebMemberDirectory?ssl=true&ssl_cert_reqs=CERT_NONE';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('album_thumb');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        
          const filename = file.originalname;
          const fileInfo = {
            filename: filename,
            bucketName: 'album_thumb'
          };
          resolve(fileInfo);
      });
    }
  });
  
const upload = multer({ storage });


const storage_one = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Math.floor(Math.random() * 9999) + 1001 + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/svg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload_album = multer({ storage: storage_one });


const GallerySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dateOfEvent: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: []
    },
    thumbnail: {
        type: String,
        required: true
    },
    tid: {
        type: String,
        required: true
    },
    privacy: {
        type: Array,
        required: true
    },
    approval: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
    
})

let album = mongoose.model('albums', GallerySchema);

const deleteFile = (path) => {
  let realPath = path.slice(21, path.length);
  fs.unlink("." + realPath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

//Create album
router.post('/createAlbum', upload.single("image"), (req,res) =>{
    
  let arr = req.body.privacy.split(',');

    const new_album = new album({
        name: req.body.name,
        dateOfEvent: req.body.dateOfEvent,
        category: req.body.category,
        thumbnail: req.file.originalname,
        tid: req.file.id,
        approval: false,
        privacy: arr,
    });

    new_album.save().then(result => {
        res.send('Album Created');
    }).catch(err => console.log(err));
})


//Create album
router.post('/uploadPhoto/:id', upload_album.array("image"), (req,res) =>{
  console.log(req.files);
  req.files.map(item => {
    let path = `http://localhost:5000/${item.path}`;
    album.update({_id: req.params.id}, { $push: { images: path } }).then(result => {
      console.log(result);
    })
  })
})

//Get all albums
router.get('/get_all_albums', (req,res) =>{
    album.find().then(result => {
        res.send(result)
    })
})

//Get all albums
router.get('/get_albums/:category', (req,res) =>{
  album.find({category: req.params.category}).then(result => {
      res.send(result)
  })
})

//Get specific album
router.get('/get_album/:id', (req,res) =>{
  album.find({_id: req.params.id}).then(result => {
      res.send(result)
  })
})

//Get thumbnail image
router.get('/getThumb', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        res.send(files);
  });
})

//Stream album thumbnail image
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


  //Approve album
router.put('/approveAlbum', (req,res) => {
    album.find({_id: req.body.id}).then(result =>{
        album.updateOne({_id: result[0]._id}, { $set: {approval: !result[0].approval}}).then(result =>{
            res.send('permission update');
        })
    })
})


//Delete album
router.delete('/removeAlbum', (req,res) =>{
    let albumid = req.body.id

    gfs.remove({ filename: req.body.name, root: 'album_thumb' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
    });

    album.findOne({_id: albumid}).then(result =>{
      result.images.map(item => {
        deleteFile(item);
      });

      album.deleteOne({_id: albumid}).then(result =>{
        res.send('Album Deleted')
      });  
    })
})

//Delete photo
router.post('/removePhoto', (req,res) =>{
  let imagename = req.body.name
  let albumid = req.body.id


      deleteFile(imagename);
      album.updateOne({_id: albumid},{ $pull: { 'images': imagename }}).then(result => {
        res.send(result)
      })

})

//Send album approval alerts
router.post('/sendAlerts/:id', (req,res) => {

  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'nirashawimalasooriya@gmail.com',
          pass: 'nirasha123'
      }
  });

  album.findOne({_id: req.params.id}).then(results => {
      for(let i =0; i < result.length; i++){
      let mailOptions = {
          from: 'nirashawimalasooriya@gmail.com',
          to: 'nirashawimalasooriya@gmail.com',
          subject: `${results.name} Album Approved - Unviversity Of Moratuwa Event Protal`,
          html: `<h2>Hello!</h2>
      <br>
      <p>Your album has been approved. Please visit to UOM event protal and start to upload images.</p>
      <br>
      <p>Thank You,</p>
      <p>Regards,</p>
      <p>Admin</p> `
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




module.exports = router;