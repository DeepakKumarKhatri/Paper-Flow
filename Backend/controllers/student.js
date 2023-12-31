const Assignment = require("../models/assignment");

const uploadAssignment = async (req, res) => {
  const title = req.body.title;
  const fileName = req.file.filename;

  try {
    await Assignment.create({ pdf: fileName, title: title });
    res.status(201).json({ message: "Assignment uploaded successfully" });
  } catch (error) {
    res.json({ message: error });
  }
};

const studentDashboad = async (req, res) => {
  const title = req.body.title;
  const fileName = req.file.filename;

  console.log(title);
  console.log(fileName);

  try {
    await Assignment.create({ pdf: fileName, title: title });
    res.status(201).json({ message: "Assignment uploaded successfully" });
  } catch (error) {
    res.json({ message: error });
  }
};

const allAssignments = async (req, res) => {
  try {
    Assignment.find({}).then(assignments =>{
      res.send({message: assignments});
    })
  } catch (error) {
    res.send({message: error});
  }
};

const getAssignment = async (req, res) => {
  res.end("getAssignment");
};

const getAssignmentSolution = async (req, res) => {
  res.end("getAssignmentSolution");
};

const allAssignmentsSolution = async (req, res) => {
  res.end("All Assignments Solution");
};

const getPastPaper = async (req, res) => {
  res.end("getPastPaper");
};

const getQuiz = async (req, res) => {
  res.end("getQuiz");
};

const allQuizzes = async (req, res) => {
  res.end("All Quizes");
};

const allQuizesSolution = async (req, res) => {
  res.end("All Quizes Solution");
};

const allPastPaper = async (req, res) => {
  res.end("All Past Papers");
};

const requestPastPaper = async (req, res) => {
  res.end("Request past paper route");
};

const requestAssignment = async (req, res) => {
  res.end("Request Assignment route");
};

const requestAssignmentSolution = async (req, res) => {
  res.end("Request Assignment Solution route");
};

const requestQuiz = async (req, res) => {
  res.end("Request Quiz route");
};

const requestQuizSolution = async (req, res) => {
  res.end("Request Quiz Solution route");
};

const uploadQuiz = async (req, res) => {
  res.end("Upload Quiz");
};

const uploadQuizSolution = async (req, res) => {
  res.end("Upload Quiz Solution");
};

const uploadAssignmentSolution = async (req, res) => {
  res.end("Upload Assignment Solution");
};

const uploadPastPaper = async (req, res) => {
  res.end("Upload Past Paper");
};

const deleteAssignment = async (req, res) => {
  res.end("Delete Assignment Past Paper");
};

const updateAssignment = async (req, res) => {
  res.end("Update Assignment Past Paper");
};

const deletePastPaper = async (req, res) => {
  res.end("Delete Past Paper Past Paper");
};

const updatePastPaper = async (req, res) => {
  res.end("Update Past Paper Past Paper");
};

const deleteAssignmentSolution = async (req, res) => {
  res.end("Delete Assignment Solution Paper");
};

const updateAssignmentSolution = async (req, res) => {
  res.end("Update AssignmentSolution Paper");
};

const deleteQuiz = async (req, res) => {
  res.end("Delete Quiz Paper Past Paper");
};

const updateQuiz = async (req, res) => {
  res.end("Update Quiz Route");
};

const deleteQuizSolution = async (req, res) => {
  res.end("Delete Quiz Solution Past Paper");
};

const updateQuizSolution = async (req, res) => {
  res.end("Update Quiz Solution Route");
};

module.exports = {
  studentDashboad,
  uploadPastPaper,
  uploadAssignmentSolution,
  uploadAssignment,
  uploadQuizSolution,
  uploadQuiz,
  requestQuizSolution,
  requestQuiz,
  requestAssignmentSolution,
  requestAssignment,
  requestPastPaper,
  updateQuizSolution,
  deleteQuizSolution,
  updateQuiz,
  deleteQuiz,
  updateAssignmentSolution,
  deleteAssignmentSolution,
  updatePastPaper,
  deletePastPaper,
  updateAssignment,
  deleteAssignment,
  allAssignments,
  allAssignmentsSolution,
  allPastPaper,
  allQuizzes,
  allQuizesSolution,
  getAssignment,
  getAssignmentSolution,
  getPastPaper,
  getQuiz,
};
