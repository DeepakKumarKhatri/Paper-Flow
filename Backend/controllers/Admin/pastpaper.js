const PastPaper = require("../../models/pastPaper");
const Course = require("../../models/course");
const MaterialSolution = require("../../models/materialSolution");
const mongoose = require("mongoose");

const unapprovedPastPapers = async (req, res) => {
  try {
    const response = await PastPaper.find({ approvedByAdmin: false });
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const approvePastPaper = async (req, res) => {
  try {
    await PastPaper.findOneAndUpdate(
      { title: req.params.title },
      { approvedByAdmin: true }
    );
    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const allPastPaper = async (req, res) => {
  try {
    const response = await PastPaper.find({ approvedByAdmin: true });
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePastPaperForUser = async (req, res) => {
  try {
    
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePastPaperFromServer = async (req, res) => {
  res.end("Delete Past Paper Past Paper");
};

const addPastPaper = async (req, res) => {
  res.end("Add PastPaper Route");
};

const adminDashboad = async (req, res) => {
  res.end("Admin Dashboad");
};

module.exports = {
  adminDashboad,
  deletePastPaperForUser,
  deletePastPaperFromServer,
  allPastPaper,
  unapprovedPastPapers,
  addPastPaper,
  approvePastPaper,
};
