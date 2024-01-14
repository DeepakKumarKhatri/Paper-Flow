const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  assignmentDate: {
    type: String,
    required: true,
  },
  // uploadedByUser: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "Student", 
  //   required: true,
  // },
  instructor: {
    type: [String],
  },
  assignmentSolutions: [
    {
      assignmentSolution: {
        type: mongoose.Types.ObjectId,
        ref: "MaterialSolution",
      },
    },
  ],
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
