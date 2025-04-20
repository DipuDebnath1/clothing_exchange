const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { conversationService } = require("../services");
const { User } = require("../models");

const createConversation = catchAsync(async (req, res) => {
  const sender = req.user.id;
  const { receiver } = req.body;

  if (!receiver) {
    return res.status(httpStatus.BAD_REQUEST).json(
      response({
        message: "Receiver is required",
        status: "FAIL",
        statusCode: httpStatus.BAD_REQUEST,
      })
    );
  }

  if (sender === receiver) {
    return res.status(httpStatus.BAD_REQUEST).json(
      response({
        message: "Cannot create a conversation with yourself",
        status: "FAIL",
        statusCode: httpStatus.BAD_REQUEST,
      })
    );
  }

  const existConversation =
    await conversationService.getConversationByParticipants(sender, receiver);

  if (existConversation) {
    return res.status(httpStatus.OK).json(
      response({
        message: "Conversation already exists",
        status: "OK",
        statusCode: httpStatus.OK,
        data: existConversation,
      })
    );
  }

  const conversationData = { sender, receiver };
  const conversation = await conversationService.createConversation(
    conversationData
  );

  return res.status(httpStatus.CREATED).json(
    response({
      message: "Conversation created successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: conversation,
    })
  );
});

const allconversationList = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await conversationService.allConversationChartList(userId);

  res.status(httpStatus.OK).json(
    response({
      message: "Successfully get all Conversations list",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const blockUser = catchAsync(async (req, res) => {
  const { conversationId, type } = req.body;
  const updatData = {};
  if (type === "blocked") {
    (updatData.blockStatus = "blocked"), (updatData.userId = req.user.id);
  }
  if (type === "unblocked") {
    (updatData.blockStatus = "unblocked"), (updatData.userId = null);
    updatData.id = req.user.id;
  }

  const updatedConversation = await conversationService.updateConversation(
    conversationId,
    updatData
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Conversation updated successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: updatedConversation,
    })
  );
});

const sendMessage = catchAsync(async (req, res) => {
  const senderId = req.user.id;
  const { conversationId, text, type } = req.body;

  const conversation = await conversationService.getConversationById(
    conversationId
  );

  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Conversation not found");
  }
  if (
    String(conversation.sender._id) !== senderId &&
    String(conversation.receiver._id) !== senderId
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not a part of this chat");
  }

  const user = await User.findById(senderId);

  const newMessage = {
    conversationId,
    text: "",
    imageUrl: "",
    videoUrl: "",
    fileUrl: "",
    type,
    msgByUserId: user,
  };

  switch (type) {
    case "text":
      newMessage.text = text;
      break;
    case "image":
      if (req.files?.image) {
        newMessage.imageUrl =
          "/uploads/messages/" + req.files.image[0].filename;
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Image file is required for type 'image'"
        );
      }
      break;
    case "video":
      if (req.files?.video) {
        newMessage.videoUrl =
          "/uploads/messages/" + req.files.video[0].filename;
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Video file is required for type 'video'"
        );
      }
      break;
    case "file":
      if (req.files?.file) {
        newMessage.fileUrl = "/uploads/messages/" + req.files.file[0].filename;
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "File is required for type 'file'"
        );
      }
      break;
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid message type");
  }

  // Save the message to the database
  const messageSent = await conversationService.addMessage(newMessage);
  if (!messageSent) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send the message"
    );
  }

  const newSocketMessage = {
    ...messageSent._doc,
    msgByUserId: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      image: user.image,
    },
  };

  // Notify the chat room
  const roomId = `new-message::${conversationId}`;
  io.emit(roomId, newSocketMessage);

  return res.status(httpStatus.CREATED).json({
    message: "Message sent successfully",
    status: "OK",
    statusCode: httpStatus.CREATED,
    data: messageSent,
  });
});

const getMessages = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);
  const conversationId = req.query.conversationId;
  const result = await conversationService.getMessages(conversationId, options);
  res.status(httpStatus.OK).json(
    response({
      message: "Messages",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const updateMessage = catchAsync(async (req, res) => {
  const { messageId } = req.body;
  const senderId = req.user.id;

  const updatedMessage = await conversationService.updateMessages(
    messageId,
    senderId,
    req.body
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Message updated successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: updatedMessage,
    })
  );
});

module.exports = {
  createConversation,
  allconversationList,
  sendMessage,
  getMessages,
  updateMessage,
  blockUser,
};
