const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { ConversationModel, MessageModel } = require("../models/conversation.model");

const createConversation = async (conversationData) => {
  const conversation = await ConversationModel.create(conversationData);

  const populatedConversation = await ConversationModel.findById(conversation._id)
    .populate('sender', 'fullName role image')
    .populate('receiver', 'fullName role image')

  return populatedConversation;
}

const getConversationByParticipants = async (participant1, participant2) => {
  const conversation = await ConversationModel.findOne({
    $or: [
      { sender: participant1, receiver: participant2 },
      { sender: participant2, receiver: participant1 },
    ],
  })
    .populate('sender', 'fullName role image')
    .populate('receiver', 'fullName role image')
    .populate('lastMessage')
    .exec();
  return conversation;
};

const getConversationById = async (id) => {
  try {
    return await ConversationModel.findById(id).populate('sender', 'fullName role image')
      .populate('receiver', 'fullName role image');
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err.message);
  }
}
const updateConversation = async (id, body) => {
  const conversation = await getConversationById(id);
  console.log(conversation);

  if (conversation.blockStatus === "blocked") {
    if (body.blockStatus === "blocked") {
      throw new ApiError(httpStatus.BAD_REQUEST, "This conversation is already blocked");
    }

    if (conversation.blockedBy.toString() !== body.id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "You can't unblock yourself");
    }
  }
  conversation.blockStatus = body.blockStatus;
  conversation.blockedBy = body.userId;
  await conversation.save();

  return conversation;
};

const allConversationChartList = async (userId) => {
  const conversations = await ConversationModel.find({
    $or: [{ sender: userId }, { receiver: userId }],
  }).sort({ updatedAt: -1 })
    .populate('sender', 'fullName role image')
    .populate('receiver', 'fullName role image')
    .populate('lastMessage');

  if (!conversations) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No conversations found");
  }

  return conversations;
};

const addMessage = async (messageData) => {

  const conversation = await getConversationById(messageData.conversationId);

  if (conversation.blockStatus === "blocked") {
    throw new ApiError(httpStatus.BAD_REQUEST, "This conversation is blocked")
  }

  // console.log("Message Data", messageData);
  const message = await MessageModel.create(messageData)

  await ConversationModel.findByIdAndUpdate(
    messageData.conversationId,
    {
      $push: { messages: message._id },
      $set: { lastMessage: message._id }
    },
    { new: true }
  )

  // return await MessageModel.findById(message._id).populate('sender', 'fullName image').populate('receiver', 'fullName image');
  return await MessageModel.findById(message._id);
};

const getMessages = async (conversationId, options) => {
  const { limit = 100, page = 1 } = options;

  const count = await MessageModel.countDocuments({
    conversationId: conversationId,
  });

  const totalPages = Math.ceil(count / limit);
  const skip = (page - 1) * limit;

  const messages = await MessageModel.find({
    conversationId: conversationId,
  })
    .populate({
      path: 'msgByUserId',
      select: 'fullName email image'
    })
    .skip(skip)
    .limit(limit)
  // .sort({ createdAt: -1 });

  const result = {
    data: messages,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    totalResults: count
  };

  return result;
};

const getMessageById = async (id) => {
  const message = await MessageModel.findById(id);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }
  return message;
}

const updateMessages = async (messageId, senderId, updateData) => {
  const message = await getMessageById(messageId);

  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }

  if (message.msgByUserId.toString() !== senderId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not allowed to update this message");
  }

  const updatedMessage = await MessageModel.findByIdAndUpdate(
    messageId,
    { $set: updateData },
    { new: true }
  );

  if (!updatedMessage) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update the message");
  }

  return updatedMessage;
};

module.exports = {
  createConversation,
  getConversationByParticipants,
  getConversationById,
  allConversationChartList,
  addMessage,
  getMessages,
  updateMessages,
  updateConversation
};
