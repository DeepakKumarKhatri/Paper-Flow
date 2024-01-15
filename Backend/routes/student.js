var express = require("express");
var router = express.Router();
var studentController = require("../controllers/student");
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

router.get("/", studentController.studentDashboad);
router.post(
  "/assignment/:courseID",
  upload.single("assignment"),
  (req, res) => studentController.uploadAssignment(req, res, storage)
);
router.get("/assignments/:courseID", studentController.allAssignments);
router.get(
  "/assignment/:courseID/:assignmentId",
  studentController.getAssignment
);

router.get(
  "/assignmentSolution/:courseID/:assignmentId",
  studentController.getAssignmentSolution
);

router.get("/pastPapers/:courseID", studentController.allPastPaper);
router.get("/pastPaper/:courseID/:year", studentController.getPastPaper);

router.get("/quizzes/:courseID", studentController.allQuizzes);
router.get("/quiz/:courseID/:quizId", studentController.getQuiz);

router.post("/assignment/:courseID", studentController.requestAssignment);

router.delete(
  "/assignment/:courseID/:assignmentId",
  studentController.deleteAssignment
);
router.patch(
  "/assignment/:courseID/:assignmentId",
  studentController.updateAssignment
);

router.post(
  "/assignmentSolution/:courseID",
  studentController.requestAssignmentSolution
);
router.post(
  "/assignmentSolution/:courseID/:assignmentId",
  studentController.uploadAssignmentSolution
);
router.delete(
  "/assignmentSolution/:courseID/:assignmentId",
  studentController.deleteAssignmentSolution
);
router.patch(
  "/assignmentSolution/:courseID/:assignmentId",
  studentController.updateAssignmentSolution
);

router.post("/pastPaper/:courseID", studentController.requestPastPaper);
router.post("/pastPaper/:courseID/:year", studentController.uploadPastPaper);
router.delete("/pastPaper/:courseID/:year", studentController.deletePastPaper);
router.patch("/pastPaper/:courseID/:year", studentController.updatePastPaper);

router.post("/quiz/:courseID", studentController.requestQuiz);
router.post("/quiz/:courseID/:quizId", studentController.uploadQuiz);
router.post("/quizSolution/:courseID", studentController.requestQuizSolution);
router.post(
  "/quizSolution/:courseID/:quizId",
  studentController.uploadQuizSolution
);
router.delete("/quiz/:courseID/:quizId", studentController.deleteQuiz);
router.delete(
  "/quizSolution/:courseID/:quizId",
  studentController.deleteQuizSolution
);
router.patch("/quiz/:courseID/:quizId", studentController.updateQuiz);
router.patch(
  "/quizSolution/:courseID/:quizId",
  studentController.updateQuizSolution
);

module.exports = router;
