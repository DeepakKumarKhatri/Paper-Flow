const mongoose = require("mongoose");

const pastPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    semester: {
      type: String,
    },
    fileType: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    uploadedByUser: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    instructor: {
      type: [String],
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    pastPaperSolutions: [
      {
        pastPaperSolution: {
          type: mongoose.Types.ObjectId,
          ref: "MaterialSolution",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PastPaper = mongoose.model("PastPaper", pastPaperSchema);
module.exports = PastPaper;
