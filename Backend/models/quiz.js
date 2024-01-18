const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    quizDate: {
      type: String,
      required: true,
    },
    uploadedByUser: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    instructor: {
      type: [String],
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
