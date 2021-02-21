const HttpError = require('../models/httperror');
const Bloguploader = require('../models/bloguploader');


const getBlog = async(req, res, next) => {
    let blog;
    try {
        blog = await Bloguploader.find({}).sort({ createdAt: -1 });

    } catch (err) {
        const error = new HttpError(
            'Somethings went wrong,could not find data', 500
        );
        return next(error);
    }
    res.send(blog)
}




const getBlogById = async(req, res, next) => {
    const blogId = req.params.id;


    let blog;
    try {
        blog = await Bloguploader.findById(blogId);
    } catch (err) {
        const error = new HttpError(
            'Someting went wrong,could not find a place', 500
        );
        return next(error);


    }
    if (!blog) {
        const error = new HttpError('Could not find a place for the provided id', 404);

        return next(error);
    }
    res.json({ blog: blog.toObject({ getters: true }) });
};




const createBlog = async(req, res, next) => {
    const { title, image, url, like, categorie, } = req.body;
    const createBlog = new Bloguploader({
        title,
        image,
        url,
        like,
        categorie
    });
    try {
        await createBlog.save();
    } catch (err) {
        const error = new HttpError(
            'Creating place faild,please try again', 500
        );
        return next(error);
    }


    res.status(201).json({ blog: createBlog });

};



const updateBlog = async(req, res, next) => {
    const { title, image, url } = req.body;
    const blogId = req.params.id;

    let blog;
    try {
        blog = await Bloguploader.findById(blogId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong,could not update place.', 500
        );
        return next(error);
    }


    blog.title = title;
    blog.image = image;
    blog.url = url;

    try {
        await blog.save();
    } catch (err) {
        const error = new HttpError(
            'Someting went wrong,could not update place', 500
        );
        return next(error);
    }

    res.status(200).json({ blog: blog.toObject({ getters: true }) });


};

const deleteBlog = async(req, res, next) => {
    const blogId = req.params.id;

    let blog;
    try {
        blog = await Bloguploader.findById(blogId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong,could not delete place', 500
        );
        return next(error);
    }

    try {
        await blog.remove();
    } catch (err) {
        const error = new HttpError(
            'Somethings went wrong,could not delete place.', 500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deletd place.' });

};


//dislike increase
const increaselike = async(req, res) => {
    Bloguploader.findOne({ "_id": req.params.id }).then((result) => {
        let currentcolor = result.likecolor;
        let newcolor = "blue";
        let currentlike = result.like;
        let newlike = currentlike + 1;
        Bloguploader.updateOne({ "_id": req.params.id }, { $set: { like: newlike, likecolor: newcolor } }).then(result => {
            res.send('like update');
        })
    })
};
//like decrease
const decreaselike = async(req, res) => {
    Bloguploader.findOne({ "_id": req.params.id }).then((result) => {
        let currentcolor = result.likecolor;
        let newcolor = "black";
        let currentlike = result.like;
        if (currentlike != 0) {
            let newlike = currentlike - 1;
            Bloguploader.updateOne({ "_id": req.params.id }, { $set: { like: newlike, likecolor: newcolor } }).then(result => {
                res.send('like decreased');

            })
        }
        res.send("can't decrease")
    })

};

//like increase
const increasedislike = async(req, res) => {
    Bloguploader.findOne({ "_id": req.params.id }).then((result) => {
        let currentcolor = result.dislikecolor;
        let newcolor = "blue";
        let currentlike = result.dislike;
        let newlike = currentlike + 1;
        Bloguploader.updateOne({ "_id": req.params.id }, { $set: { dislike: newlike, dislikecolor: newcolor } }).then(result => {
            res.send('dislike update');
        })
    })
};
//like decrease
const decreasedislike = async(req, res) => {
    Bloguploader.findOne({ "_id": req.params.id }).then((result) => {
        let currentcolor = result.dislikecolor;
        let newcolor = "black";
        let currentlike = result.dislike;
        if (currentlike != 0) {
            let newlike = currentlike - 1;
            Bloguploader.updateOne({ "_id": req.params.id }, { $set: { dislike: newlike, dislikecolor: newcolor } }).then(result => {
                res.send('dislike decreased');

            })
        }
        res.send("can't decrease")
    })

};



exports.getBlog = getBlog;
exports.getBlogById = getBlogById;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
exports.increaselike = increaselike;
exports.decreaselike = decreaselike;
exports.increasedislike = increasedislike;
exports.decreasedislike = decreasedislike;