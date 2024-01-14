const mongoose = require("mongoose");

const pastPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  pastPaperDate: {
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
  pastPaperSolutions: [
    {
      pastPaperSolution: {
        type: mongoose.Types.ObjectId,
        ref: "MaterialSolution",
      },
    },
  ],
});

const PastPaper = mongoose.model("PastPaper", pastPaperSchema);
module.exports = PastPaper;
