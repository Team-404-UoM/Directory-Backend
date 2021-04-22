const express = require('express');
const notificationcontrollers = require('../controllers/notification');
const router = express.Router();

router.post('/', notificationcontrollers.createNotification);
router.get('/', notificationcontrollers.getNotification);
/* router.delete('/:id', notificationcontrollers.deleteNotification); */
module.exports = router;