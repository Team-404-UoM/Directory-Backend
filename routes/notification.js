const express = require('express');
const notificationcontrollers = require('../controllers/notification');
const router = express.Router();

router.post('/', notificationcontrollers.createNotification);
router.get('/', notificationcontrollers.getNotification);

module.exports = router;