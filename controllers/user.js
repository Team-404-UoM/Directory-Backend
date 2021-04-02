const HttpError = require('../models/httperror');
const pastStudents = require('../models/signupmodels');


const getUserId = async(req, res, next) => {
    const userId = req.params.id;
    let user;
    try {
        user = await pastStudents.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'Someting went wrong,could not find a place', 500
        );
        return next(error);


    }
    if (!user) {
        const error = new HttpError('Could not find a place for the provided id', 404);

        return next(error);
    }
    res.json({ user: user.toObject({ getters: true }) });
};

exports.getUserId = getUserId;