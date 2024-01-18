const mongoose = require("mongoose");

const materialSolutionSchema = new mongoose.Schema(
  {
    uploadedByUser: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    url: {
      type: String,
      required: true,
    },
    solutionFileName: {
      type: String,
      required: true,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MaterialSolution = mongoose.model(
  "MaterialSolution",
  materialSolutionSchema
);
module.exports = MaterialSolution;
