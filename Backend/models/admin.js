const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
  userType: {
    type: String,
    default: "Administrator",
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

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
