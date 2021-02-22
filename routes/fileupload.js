const express = require("express")
const path = require("path")
const multer = require("multer")
const router = express.Router();
//const Img = require('../models/imageUrl');
const Img = require('../models/blog');




//var upload = multer({ dest: "upload" })
// If you do not want to use diskStorage then uncomment it 

var storage = multer.diskStorage({
    destination: function(req, file, cb) {

        // Uploads is the Upload_folder_name 
        cb(null, 'images')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + "-" + Date.now() + ".jpg")
            //const imgname = Date.now() + '-' + file.originalname;
            //cb(null, imgname)
            //const fileName = file.originalname.toLowerCase().split(" ").join("-");
            //cb(null, req.params.contentId + "-" + fileName);
    }
})

// Define the maximum size for uploading 
// picture i.e. 1 MB. it is optional 
//const maxSize = 1 * 1000 * 1000;

var upload = multer({
    storage: storage,
    /* fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
}); */
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

}) /* .single('file'); */


router.put('/upload/:id', upload.single('file'), (req, res) => {
        //const url = req.protocol + "://" + req.get("host");
        //const id = req.params.id;
        Img.updateOne({ "_id": req.params.id }, {
            $set: {
                coverImage: req.file.filename
            }
        }).then(result => {
            res.send('photo update');
        })

    })
    /* const path = new Img({
        url: req.file.filename
    })
    path.save() 
        .then(result => res.send('New URL Added'))
        .catch(err => console.log(err));
});*/

/* router.put('/upload/:_id', upload.single('file'), (req, res) => {

    const blogId = req.params._id;

    let blog;
    try {
        blog = await Blog.findById(blogId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong,could not update place.', 500
        );
        return next(error);
    }


    blog.coverImage = req.file.filename;

    try {
        await blog.save();
    } catch (err) {
        const error = new HttpError(
            'Someting went wrong,could not update place', 500
        );
        return next(error);
    }

    res.status(200).json({ blog: blog.toObject({ getters: true }) });


}) */



/* router.post('/upload', function(req, res, next) {

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
}) */


router.post('/url', (req, res) => {

    const URL = new Img({
        url: req.body.url


    });

    URL.save()
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