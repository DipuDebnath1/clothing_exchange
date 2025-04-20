const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { notificationController } = require("../../controllers");


router.get('/', auth("common"), notificationController.AllNotification)
router.post('/send_mail', auth("admin"), notificationController.SendMailToUser)

module.exports = router;
