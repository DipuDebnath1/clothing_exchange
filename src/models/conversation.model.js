const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "conversationId is required"],
      ref: "Conversation",
    },
    text: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "msgByUserId is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: [true, "sender is required"],
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: [true, "receiver is required"],
      ref: "User",
    },
    product: {
      type: mongoose.Schema.ObjectId,
      required: [true, "product is required"],
      ref: "Product",
    },
    lastMessage: {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
      default: null,
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Message",
      },
    ],
    blockedBy: {
      type: mongoose.Schema.ObjectId,
      required: false,
      ref: "User",
      default: null,
    },
    blockStatus: {
      type: String,
      enum: ["blocked", "unblocked"],
      default: "unblocked",
    },
  },
  {
    timestamps: true,
  }
);


messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

conversationSchema.plugin(toJSON);
conversationSchema.plugin(paginate);

const MessageModel = mongoose.model("Message", messageSchema);
const ConversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = {
  MessageModel,
  ConversationModel,
};
