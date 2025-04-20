const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: [true, "author is required"],
    },
    reportBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: [true, "reportBy is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to Product model
      required: [true, "product is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // To record when the document was created and last updated
  }
);

const Report = mongoose.model("Report", reportSchema); // Capitalize model name

module.exports = Report;
