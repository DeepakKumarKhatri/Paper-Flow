const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unqiue: true,
  },
  password: {
    type: String,
    required: true,
  },
  uploadedQuizzes: [
    {
      uploadedQuiz: {
        type: mongoose.Types.ObjectId,
        ref: "Quiz",
      },
    },
  ],
  uploadedAssignments: [
    {
      uploadedAssignment: {
        type: mongoose.Types.ObjectId,
        ref: "Assignment",
      },
    },
  ],
  uploadedPastPapers: [
    {
      uploadedPastPaper: {
        type: mongoose.Types.ObjectId,
        ref: "PastPaper",
      },
    },
  ],
  uploadedSolutions: [
    {
      uploadedSolution: {
        type: mongoose.Types.ObjectId,
        ref: "MaterialSolution",
      },
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
