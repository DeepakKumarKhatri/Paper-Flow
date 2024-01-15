const adminDashboad = async (req, res) => {
  res.end("Admin Dashboad");
};

const allPastPaper = async (req, res) => {
  res.end("All Past Papers");
};

const deletePastPaper = async (req, res) => {
  res.end("Delete Past Paper Past Paper");
};

const unapprovedPastPapers = async (req, res) => {
  res.end("Unapproved Past Paper Route");
};

const addPastPaper = async (req, res) => {
  res.end("Add PastPaper Route");
};

module.exports = {
  adminDashboad,
  deletePastPaper,
  allPastPaper,
  unapprovedPastPapers,
  addPastPaper,
};
