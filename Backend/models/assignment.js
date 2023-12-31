const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  pdf: String,
  title: String,
});

const Assignment = mongoose.model("assignment", assignmentSchema);
module.exports = Assignment;