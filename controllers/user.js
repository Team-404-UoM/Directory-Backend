const HttpError = require('../models/httperror');
const pastStudents = require('../models/signupmodels');


const getUserId = async(req, res, next) => {
    const userId = req.params.id;
    console.log(userId);
    let user;
    try {
        user = await pastStudents.findOne({ firebaseUserId: userId });
    } catch (err) {
        const error = new HttpError(
            'Someting went wrong,could not find a place', 500
        );
        return next(error);


    }
    res.send(user)
};

exports.getUserId = getUserId;