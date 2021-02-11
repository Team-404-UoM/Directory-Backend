const express = require("express")
const path = require("path")
const multer = require("multer")
const router = express.Router();
const Img = require('../models/imageUrl');




//var upload = multer({ dest: "upload" })
// If you do not want to use diskStorage then uncomment it 

var storage = multer.diskStorage({
    destination: function(req, file, cb) {

        // Uploads is the Upload_folder_name 
        cb(null, 'images')
    },
    filename: function(req, file, cb) {
        //cb(null, file.originalname + "-" + Date.now() + ".jpg")
        cb(null, Date.now() + '-' + file.originalname)
    }
})

// Define the maximum size for uploading 
// picture i.e. 1 MB. it is optional 
//const maxSize = 1 * 1000 * 1000;

var upload = multer({
    storage: storage,
    //limits: { fileSize: maxSize },
    /* fileFilter: function(req, file, cb) {

        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the " +
            "following filetypes - " + filetypes);
    } */

    // mypic is the name of file attribute 
}).single('file');



router.post('/upload', function(req, res, next) {

    // Error MiddleWare for multer file upload, so if any 
    // error occurs, the image would not be uploaded! 
    upload(req, res, function(err) {

        if (err) {

            // ERROR occured (here it can be occured due 
            // to uploading image of size greater than 
            // 1MB or uploading different file type) 
            res.send(err)
        } else {

            // SUCCESS, image successfully uploaded 
            res.send("Success, Image uploaded!")
        }
    })
})


router.post('/url', (req, res) => {
    const Url = new Img({
        URL: req.body.URL

    });

    Url.save()
        .then(result => res.send('New URL Added'))
        .catch(err => console.log(err));

});
router.get('/allurl', (req, res) => {
    Img.find().then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
    });
});
module.exports = router;

// Take any port number of your choice which 
// is not taken by any other process