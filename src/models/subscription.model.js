const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "author is required"],
      ref:"User"
    },
    packageDurationType: {
      type: String,
      enum: ["day", "month"],
      required: [true, "package Duration Type is required"],
    },
    packageDuration: {
      type: Number,
      required: [true, "package Duration is required"],
    },
    packageFacility: {
      type: [String],
      required: false,
    },
    packagePrice: {
      type: Number,
      required: [true, "package price required !"],
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "close"],
      default: "active",
      required: false,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// **Pre-find Middleware**: Automatically exclude documents where `isDeleted: true`
// subscriptionSchema.pre(/^find/, function (next) {
//   this.where({ isDeleted: false });
//   next();
// });

module.exports = mongoose.model("Subscription", subscriptionSchema);
