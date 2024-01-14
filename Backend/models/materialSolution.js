const mongoose = require("mongoose");

const materialSolutionSchema = new mongoose.Schema({
  uploadedByUser: {
    type: Number,
    required: true,
  }
});

const MaterialSolution = mongoose.model("MaterialSolution", materialSolutionSchema);
module.exports = MaterialSolution;
