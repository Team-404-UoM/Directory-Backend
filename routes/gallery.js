const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const storage_l = require('node-persist');
storage_l.init({expiredInterval: 2 * 60 * 1000});
const router = express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream')

const mongoURI = ' mongodb+srv://nirasha:1CVOHXmNP8iqpaVt@cluster0.bycqq.mongodb.net/event_planning_db?ssl=true&ssl_cert_reqs=CERT_NONE';

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

//Get all albums
router.get('/get_all_albums', (req,res) =>{
    album.find().then(result => {
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


// router.get('/getAlbums', (req,res) =>{ 
//     mongoose.connection.db.listCollections().toArray(function (err, names) {
//         if (err) {
//           console.log(err);
//         } else {
//         let data = []
//           names.map(item =>{
//               if(item.name.match(/_photos/gi)){
//                 const Album = mongoose.model(`${item.name}`, GallerySchema)
//                 Album.find().then(result =>{
//                     data.push(result)
//                     storage_l.setItem('albums', data)
//                 })
//               }
//           })
//           storage_l.getItem('albums').then(out => {
//             let outputArr = []
//             out.map(item1 =>{
//                 item1.map(item =>{
//                     outputArr.push(item)
//                 })
//             })
//             res.send(outputArr)
//           })
//         }
//     })
// })

//Delete album
router.delete('/removeAlbum', (req,res) =>{
    let albumid = req.body.id

    gfs.remove({ filename: req.body.name, root: 'album_thumb' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
      album.deleteOne({_id: albumid}).then(result =>{
        res.send('Album Deleted')
      })
    });
})




module.exports = router;