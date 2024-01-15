const allAssignments = async (req, res) => {
  res.end("All Assignments");
};

const allAssignmentsSolution = async (req, res) => {
  res.end("All Assignments Solution");
};

const deleteAssignment = async (req, res) => {
  res.end("Delete Assignment Past Paper");
};

const deleteAssignmentSolution = async (req, res) => {
  res.end("Delete Assignment Solution Paper");
};

const unapprovedAssignments = async (req, res) => {
  res.end("Unapproved Assignment Route");
};

const unapprovedAssignmentSolutions = async (req, res) => {
  res.end("Unapproved Assignment Solution Route");
};

const addAssignment = async (req, res) => {
  res.end("Add Assignment Route");
};

const addAssignmentSolution = async (req, res) => {
  res.end("Add Assignment Solution Route");
};

module.exports = {
  deleteAssignmentSolution,
  deleteAssignment,
  allAssignments,
  allAssignmentsSolution,
  unapprovedAssignments,
  unapprovedAssignmentSolutions,
  addAssignment,
  addAssignmentSolution,
};
