const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    quizDate: {
      type: String,
    },
    fileType: {
      type: String,
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
    url: {
      type: String,
      required: true,
    },
    quizSolutions: [
      {
        quizSolution: {
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

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
