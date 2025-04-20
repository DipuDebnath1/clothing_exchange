const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "question is required"],
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Faq", faqSchema);
