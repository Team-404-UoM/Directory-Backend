const HttpError = require('../models/httperror');
const Forum = require('../models/forum');


//get all qestions
const getForum = async(req, res, next) => {
    let forum;
    const usertype = req.query.type;
    const faculty = req.query.faculty;
    const userId = req.query.userid;
    console.log(usertype);
    console.log(faculty);
    console.log(userId);
    if (usertype == "ACADEMIC") {
        try {
            forum = await Forum.find({ $or: [{ privacytype: "academic" }, { privacytype: "all" }, { userId: userId }] });

        } catch (err) {
            const error = new HttpError(
                'Somethings went wrong,could not find data', 500
            );
            return next(error);
        }
        res.send(forum)
    } else if (usertype == "PAST_STUDENT") {
        try {
            forum = await Forum.find({ $or: [{ privacytype: "all" }, { faculty: faculty }, { faculty: "all" }, { userId: userId }] });

        } catch (err) {
            const error = new HttpError(
                'Somethings went wrong,could not find data', 500
            );
            return next(error);
        }
        res.send(forum)

    }
}




//get uniq question
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



//create question
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


//Update question
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
//delete question
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