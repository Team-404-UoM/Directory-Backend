const HttpError = require('../models/httperror');
const Forum = require('../models/forum');



const getForum = async(req, res, next) => {
    let forum;
    try {
        forum = await Forum.find({});

    } catch (err) {
        const error = new HttpError(
            'Somethings went wrong,could not find data', 500
        );
        return next(error);
    }
    res.send(forum)
}





const getForumById = async(req, res, next) => {
    const forumId = req.params.id;


    let forum;
    try {
        forum = await Forum.findById(forumId);
    } catch (err) {
        const error = new HttpError(
            'Someting went wrong,could not find a place', 500
        );
        return next(error);


    }
    if (!forum) {
        const error = new HttpError('Could not find a place for the provided id', 404);

        return next(error);
    }
    res.json({ forum: forum.toObject({ getters: true }) });
};




const createForum = async(req, res, next) => {
    const { message, reply, privacytype, faculty, firebaseId, userId, lastname, firstname, userType } = req.body;
    const createForum = new Forum({
        message,
        reply,
        privacytype,
        faculty,
        userId,
        firebaseId,
        lastname,
        firstname,
        userType
    });
    try {
        await createForum.save();
    } catch (err) {
        const error = new HttpError(
            'Creating place faild,please try again', 500
        );
        return next(error);
    }


    res.status(201).json({ forum: createForum });

};



const updateForum = async(req, res, next) => {
    const { message } = req.body;
    const forumId = req.params.id;

    let forum;
    try {
        forum = await Forum.findById(forumId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong,could not update place.', 500
        );
        return next(error);
    }


    forum.message = message;


    try {
        await forum.save();
    } catch (err) {
        const error = new HttpError(
            'Someting went wrong,could not update place', 500
        );
        return next(error);
    }

    res.status(200).json({ forum: forum.toObject({ getters: true }) });


};

const deleteForum = async(req, res, next) => {
    const forumId = req.params.id;

    let forum;
    try {
        forum = await Forum.findById(forumId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong,could not delete place', 500
        );
        return next(error);
    }

    try {
        await forum.remove();
    } catch (err) {
        const error = new HttpError(
            'Somethings went wrong,could not delete place.', 500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deletd place.' });

};



exports.getForum = getForum;
exports.getForumById = getForumById;
exports.createForum = createForum;
exports.updateForum = updateForum;
exports.deleteForum = deleteForum;