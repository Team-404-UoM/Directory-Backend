const HttpError = require('../models/httperror');
const Bloguploader = require('../models/bloguploader');


const getBlog = async(req, res, next) => {
    let blog;
    try {
        blog = await Bloguploader.find({});

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
    const { title, image, url } = req.body;
    const createBlog = new Bloguploader({
        title,
        image,
        url
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
exports.getBlog = getBlog;
exports.getBlogById = getBlogById;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;