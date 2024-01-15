const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  assignmentDate: {
    type: String,
  },
  fileType: {
    type: String,
  },
  // uploadedByUser: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "Student", 
  //   required: true,
  // },
  // instructor: {
  //   type: [String],
  // },
  url:{
    type: String,
    required: true,
  },
  // assignmentSolutions: [
  //   {
  //     assignmentSolution: {
  //       type: mongoose.Types.ObjectId,
  //       ref: "MaterialSolution",
  //     },
  //   },
  // ],
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
