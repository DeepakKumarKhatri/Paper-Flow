var express = require("express");
var router = express.Router();
var studentAssignmentController = require("../controllers/Student/assignment");
var studentQuizController = require("../controllers/Student/quiz");
var studentPastPaperController = require("../controllers/Student/pastpaper");
const multer = require("multer");
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
const { firebaseConfig } = require("../configuration/config");

//Initialize the firebase application
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", studentPastPaperController.studentDashboad);
router.post("/assignment/:courseID", upload.single("assignment"), (req, res) =>
  studentAssignmentController.uploadAssignment(req, res, storage)
);
router.get(
  "/assignments/:courseID",
  studentAssignmentController.allAssignments
);
router.get(
  "/assignment/:courseID/:title",
  studentAssignmentController.getAssignment
);

router.get(
  "/assignmentSolution/:courseID/:assignmentId",
  studentAssignmentController.getAssignmentSolution
);

router.get("/pastPapers/:courseID", studentPastPaperController.allPastPaper);
router.get("/pastPaper/:courseID/:year", studentPastPaperController.getPastPaper);

router.get("/quizzes/:courseID", studentQuizController.allQuizzes);
router.get("/quiz/:courseID/:quizId", studentQuizController.getQuiz);

router.post(
  "/assignment/:courseID",
  studentAssignmentController.requestAssignment
);

router.delete(
  "/assignment/:courseID/:assignmentId",
  studentAssignmentController.deleteAssignment
);
router.patch(
  "/assignment/:courseID/:assignmentId",
  studentAssignmentController.updateAssignment
);

router.post(
  "/assignmentSolution/:courseID",
  studentAssignmentController.requestAssignmentSolution
);
router.post(
  "/assignmentSolution/:courseID/:assignmentId",
  studentAssignmentController.uploadAssignmentSolution
);
router.delete(
  "/assignmentSolution/:courseID/:assignmentId",
  studentAssignmentController.deleteAssignmentSolution
);
router.patch(
  "/assignmentSolution/:courseID/:assignmentId",
  studentAssignmentController.updateAssignmentSolution
);

router.post("/pastPaper/:courseID", studentPastPaperController.requestPastPaper);
router.post("/pastPaper/:courseID/:year", studentPastPaperController.uploadPastPaper);
router.delete("/pastPaper/:courseID/:year", studentPastPaperController.deletePastPaper);
router.patch("/pastPaper/:courseID/:year", studentPastPaperController.updatePastPaper);

router.post("/quiz/:courseID", studentQuizController.requestQuiz);
router.post("/quiz/:courseID/:quizId", studentQuizController.uploadQuiz);
router.post(
  "/quizSolution/:courseID",
  studentQuizController.requestQuizSolution
);
router.post(
  "/quizSolution/:courseID/:quizId",
  studentQuizController.uploadQuizSolution
);
router.delete("/quiz/:courseID/:quizId", studentQuizController.deleteQuiz);
router.delete(
  "/quizSolution/:courseID/:quizId",
  studentQuizController.deleteQuizSolution
);
router.patch("/quiz/:courseID/:quizId", studentQuizController.updateQuiz);
router.patch(
  "/quizSolution/:courseID/:quizId",
  studentQuizController.updateQuizSolution
);

module.exports = router;
