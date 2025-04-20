const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "author is required"],
    },
    transactionType: {
      type: String,
      enum: ["SubscriptionPurchase", "OneTimeTicket"],
      required: [true, "transaction Type is required !"],
    },
    amount: {
      type: Number,
      required: [true, "booking amount is required"],
    },
    subscriptionPurchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Subscription",
      required: false,
    },
    subEventBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubEvent",
      required: false,
    },
    transactionId: {
      type: String,
      unique: true,
      required: [true, "transaction id is required"],
    },
    status: {
      type: String,
      enum: ["pending", "success", "cancelled", "failed"],
      required: false,
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// transactionSchema.pre("validate", function (next) {
//   if (!this.transactionType && !this.transactionType) {
//     const err = new Error(
//       "Either 'subscriptionPurchaseId' or 'subEventBooking' must be provided."
//     );
//     return next(err);
//   }
//   next();
// });

module.exports = mongoose.model("Transaction", transactionSchema);
