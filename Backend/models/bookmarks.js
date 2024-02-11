const mongoose = require("mongoose");

const bookMarksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    uploadedByUser: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bookmarks = mongoose.model("Bookmarks", bookMarksSchema);
module.exports = Bookmarks;
