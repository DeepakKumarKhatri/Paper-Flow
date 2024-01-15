const Assignment = require("../models/assignment");
const Course = require("../models/course");

const {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const studentDashboad = async (req, res) => {
  res.end("Welcome Student Dashboad");
};

function formatDateNow() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}-${formattedMonth}-${year}`;
}

const uploadAssignment = async (req, res, storage) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.courseID });

    if (course.length === 0) {
      res.json({ status: "error", message: "Course not found" });
      return;
    }

    const fileName = Date.now() + "_" + req.file.originalname;

    const storageRef = ref(storage, `Assignments/${fileName}`);

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);
    const assignmentResponse = await Assignment.create({
      title: fileName,
      assignmentDate: formatDateNow(),
      fileType: req.file.mimetype,
      // uploadedByUser: null,
      // instructor: req.body.instructor,
      assignmentSolutions: [],
      url: downloadURL,
    });

    // Ensure the 'assignments' array is initialized before pushing
    if (!course.assignments) {
      course.assignments = [];
    }

    // Push the assignment into the 'assignments' array
    course.assignments.push(assignmentResponse);

    // Save the course
    await course.save();

    res.status(201).json({ status: "OK" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const allAssignments = async (req, res) => {
  try {
    Assignment.find({}).then((assignments) => {
      res.send({ message: assignments });
    });
  } catch (error) {
    res.send({ message: error });
  }
};

const getAssignment = async (req, res) => {
  res.end("getAssignment");
};

const getAssignmentSolution = async (req, res) => {
  res.end("getAssignmentSolution");
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
  allPastPaper,
  allQuizzes,
  allQuizesSolution,
  getAssignment,
  getAssignmentSolution,
  getPastPaper,
  getQuiz,
};
