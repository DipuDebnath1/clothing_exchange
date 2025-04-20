const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming "User" is the collection storing author information
      required: [true, "author is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Assuming "Product" is the collection storing product information
      required: [true, "product is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // To record when the document was created and last updated
  }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
