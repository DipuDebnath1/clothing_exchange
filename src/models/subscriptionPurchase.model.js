const mongoose = require("mongoose");

const subscriptionPurchaseSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: [true, "Subscription is required"],
      index: true,
    },
    startDate: {
      type: Date,
      required:[true, "start date required "]
    },
    endDate: {
      type: Date,
      required:[true, "end date required "]
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('SubscriptionPurchase', subscriptionPurchaseSchema)