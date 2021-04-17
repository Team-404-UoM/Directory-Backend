const HttpError = require('../models/httperror');
const Notification = require('../models/notification');

//create notificaton
const createNotification = async(req, res, next) => {
    const { NotificationType, Title, Message, OwnerUserId, OwnerfirebaseId, Date } = req.body;
    const createNotification = new Notification({
        NotificationType,
        Title,
        Message,
        OwnerUserId,
        OwnerfirebaseId,
        Date

    });
    try {
        await createNotification.save();
    } catch (err) {
        const error = new HttpError(
            'Creating place faild,please try again', 500
        );
        return next(error);
    }


    res.status(201).json({ notification: createNotification });

};
//get notification
const getNotification = async(req, res, next) => {
    let notification;
    const userId = req.query.id;


    try {
        notification = await Notification.find({
            OwnerfirebaseId: userId
        }).sort({ Date: -1 });

    } catch (err) {
        const error = new HttpError(
            'Somethings went wrong,could not find data', 500
        );
        return next(error);
    }
    res.send(notification)

}


exports.createNotification = createNotification;
exports.getNotification = getNotification;