const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  courseName: {
    type: String,
    unique: true,
    required: true,
  },
  quizzes: [
    {
      quiz: {
        type: mongoose.Types.ObjectId,
        ref: "Quiz",
      },
    },
  ],
  assignments: [
    {
      assignment: {
        type: mongoose.Types.ObjectId,
        ref: "Assignment",
      },
    },
  ],
  pastPapers: [
    {
      pastPaper: {
        type: mongoose.Types.ObjectId,
        ref: "PastPaper",
      },
    },
  ],
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
