const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    adminControlled: {
      type: Boolean,
      default: true,
    },
    userType: {
      type: String,
      default: "Student",
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
    userRequests: [
      {
        userRequest: {
          type: mongoose.Types.ObjectId,
          ref: "UserRequest",
        },
      },
    ],
    studentCourses: [
      {
        studentCourse: {
          type: mongoose.Types.ObjectId,
          ref: "Course",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
