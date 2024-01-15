const Assignment = require("../../models/assignment");
const Course = require("../../models/course");
const formatDateNow = require("../../helpers/formattedDate");

const {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const getQuiz = async (req, res) => {
  res.end("getQuiz");
};

const allQuizzes = async (req, res) => {
  res.end("All Quizes");
};

const allQuizesSolution = async (req, res) => {
  res.end("All Quizes Solution");
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
  uploadQuizSolution,
  uploadQuiz,
  requestQuizSolution,
  requestQuiz,
  updateQuizSolution,
  deleteQuizSolution,
  updateQuiz,
  deleteQuiz,
  allQuizzes,
  allQuizesSolution,
  getQuiz,
};
