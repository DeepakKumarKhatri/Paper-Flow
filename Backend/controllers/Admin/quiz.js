const allQuizzes = async (req, res) => {
  res.end("All Quizes");
};

const allQuizesSolution = async (req, res) => {
  res.end("All Quizes Solution");
};

const deleteQuiz = async (req, res) => {
  res.end("Delete Quiz Paper Past Paper");
};

const deleteQuizSolution = async (req, res) => {
  res.end("Delete Quiz Solution Past Paper");
};

const unapprovedQuizzes = async (req, res) => {
  res.end("Unapproved Quiz Route");
};

const unapprovedQuizzesSolutions = async (req, res) => {
  res.end("Unapproved Quiz Solution Route");
};

const addQuiz = async (req, res) => {
  res.end("Add Quiz Route");
};

const addQuizSolution = async (req, res) => {
  res.end("Add QuizSolution Route");
};

module.exports = {
  deleteQuizSolution,
  deleteQuiz,
  allQuizzes,
  allQuizesSolution,
  unapprovedQuizzes,
  unapprovedQuizzesSolutions,
  addQuiz,
  addQuizSolution,
};
