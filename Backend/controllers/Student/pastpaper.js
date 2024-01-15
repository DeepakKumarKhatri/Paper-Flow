const Assignment = require("../../models/assignment");
const Course = require("../../models/course");
const formatDateNow = require("../../helpers/formattedDate");

const {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const studentDashboad = async (req, res) => {
  res.end("Welcome Student Dashboad");
};

const getPastPaper = async (req, res) => {
  res.end("getPastPaper");
};

const allPastPaper = async (req, res) => {
  res.end("All Past Papers");
};

const requestPastPaper = async (req, res) => {
  res.end("Request past paper route");
};

const uploadPastPaper = async (req, res) => {
  res.end("Upload Past Paper");
};

const deletePastPaper = async (req, res) => {
  res.end("Delete Past Paper Past Paper");
};

const updatePastPaper = async (req, res) => {
  res.end("Update Past Paper Past Paper");
};

module.exports = {
  studentDashboad,
  uploadPastPaper,
  requestPastPaper,
  updatePastPaper,
  deletePastPaper,
  allPastPaper,
  getPastPaper,
};
