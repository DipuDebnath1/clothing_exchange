const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming "User" is the collection storing author information
      required: [true, "author is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    age: {
      type: String,
      enum: ["0-1", "1-3", "4-9", "10-15", "16-21"], // age categories
      required: [true, "age is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "custom"], // Assuming gender options are "male", "female", or "custom"
      required: [true, "gender is required"],
    },
    location: {
      type: String, // Assuming location is stored as a type (String)
      required: [true, "location is required"],
    },
    color: {
      type: String,
      required: [true, "color is required"],
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      required: [true, "status is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming the change is tracked by a User who made the change
      required: [true, "changedBy is required"],
    },
  },
  {
    timestamps: true, // To record when the document was created and last updated
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
