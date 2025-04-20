const mongoose = require("mongoose");

const legalNoticeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    content: {
      type: String,
      required: [true, 'content is required'],
    }
  },
  {
    timestamps: true, // To record when the document was created and last updated
  }
);

const LegalNotice = mongoose.model("LegalNotice", legalNoticeSchema);

module.exports = LegalNotice;
