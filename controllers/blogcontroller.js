 const HttpError = require('../models/httperror');
 const Blog = require('../models/blog');





 //Get all articles
 const getBlog = async(req, res, next) => {
     let blog;
     try {
         blog = await Blog.find({});

     } catch (err) {
         const error = new HttpError(
             'Somethings went wrong,could not find data', 500
         );
         return next(error);
     }
     res.send(blog)
 }



 //Read article
 const getBlogById = async(req, res, next) => {
     const blogId = req.params.id;


     let blog;
     try {
         blog = await Blog.findById(blogId);
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



 //create article
 const createBlog = async(req, res, next) => {
     const { title, image, body, like, filename } = req.body;
     const createBlog = new Blog({
         title,
         image,
         body,
         like,
         blogImage,

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


 //Edit article
 const updateBlog = async(req, res, next) => {
     const { title, image, body } = req.body;
     const blogId = req.params.id;

     let blog;
     try {
         blog = await Blog.findById(blogId);
     } catch (err) {
         const error = new HttpError(
             'Something went wrong,could not update place.', 500
         );
         return next(error);
     }


     blog.title = title;
     blog.image = image;
     blog.body = body;

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
 //Delete article
 const deleteBlog = async(req, res, next) => {
     const blogId = req.params.id;

     let blog;
     try {
         blog = await Blog.findById(blogId);
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

 const increaselike = async(req, res) => {
     Blog.findOne({ "_id": req.params.id }).then((result) => {
         let currentcolor = result.color;
         let newcolor = "info";
         let currentlike = result.like;
         let newlike = currentlike + 1;
         Blog.updateOne({ "_id": req.params.id }, { $set: { like: newlike, color: newcolor } }).then(result => {
             res.send('like update');
         })
     })
 };

 const decreaselike = async(req, res) => {
     Blog.findOne({ "_id": req.params.id }).then((result) => {
         let currentcolor = result.color;
         let newcolor = "outline-info";
         let currentlike = result.like;
         if (currentlike != 0) {
             let newlike = currentlike - 1;
             Blog.updateOne({ "_id": req.params.id }, { $set: { like: newlike, color: newcolor } }).then(result => {
                 res.send('like decreased');

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