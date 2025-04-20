const express = require("express");
const auth = require("../../middlewares/auth");
// const messageFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const { conversationController } = require("../../controllers");
// const UPLOADS_FOLDER_MESSAGE = "./public/uploads/messages";

// const uploadMessageFile = messageFileUploadMiddleware(UPLOADS_FOLDER_MESSAGE);

const router = express.Router();

router
  .route("/create")
  .post(auth("common"), conversationController.createConversation);
router
  .route("/conversation_list")
  .get(auth("common"), conversationController.allconversationList);
router.route("/send_message").post(
  auth("common"),
//   uploadMessageFile.fields([
//     { name: "image", maxCount: 1 },
//     { name: "video", maxCount: 1 },
//     { name: "file", maxCount: 1 },
//   ]),
//   convertHeicToPngMiddleware(UPLOADS_FOLDER_MESSAGE),
  conversationController.sendMessage
);
router
  .route("/get-messages")
  .get(auth("common"), conversationController.getMessages);
router
  .route("/update-messages")
  .patch(auth("common"), conversationController.updateMessage);

router.route("/block").post(auth("common"), conversationController.blockUser);

module.exports = router;

