const mongoose = require("mongoose");
const { Schema } = mongoose;
const { roles } = require("../config/roles");

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    sendBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    role: {
      type: String,
      required: false,
      enum: roles,
      default: null,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref:"Transaction"
    },
    subEventId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref:"SubEvent"
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
