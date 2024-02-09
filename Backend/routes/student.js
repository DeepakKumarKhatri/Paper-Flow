var express = require("express");
var router = express.Router();
var studentAssignmentController = require("../controllers/Student/assignment");
var studentQuizController = require("../controllers/Student/quiz");
var studentPastPaperController = require("../controllers/Student/pastpaper");
var studentInformationController = require("../controllers/Student/student");
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

/*  ************************** ASSIGNMENTS START **************************   */

/*DONE*/
router.get("/", studentPastPaperController.studentDashboad);

/*DONE*/
router.get(
  "/assignments/:courseID",
  studentAssignmentController.allAssignments
);

/*DONE*/
router.get(
  "/allCourses/:studentID",
  studentAssignmentController.studentCourses
);

/*DONE*/
router.post("/assignment/:courseID", upload.single("assignment"), (req, res) =>
  studentAssignmentController.uploadAssignment(req, res, storage)
);

/*DONE*/
router.get(
  "/assignment/:courseID/:title",
  studentAssignmentController.getAssignment
);

/*DONE*/
router.post(
  "/assignmentSolution/:courseID/:title",
  upload.single("assignmentSolution"),
  (req, res) =>
    studentAssignmentController.uploadAssignmentSolution(req, res, storage)
);

/*DONE*/
router.get(
  "/assignmentSolution/:objectID",
  studentAssignmentController.getAssignmentSolution
);

/*DONE*/
router.delete(
  "/assignment/:courseID/:title",
  studentAssignmentController.deleteAssignment
);

/*DONE*/
router.patch(
  "/assignment/:courseID/:title",
  upload.single("assignment"),
  (req, res) => studentAssignmentController.updateAssignment(req, res, storage)
);
/*DONE*/
router.delete(
  "/assignmentSolution/:courseID/:title",
  studentAssignmentController.deleteAssignmentSolution
);
/*DONE*/
router.patch(
  "/assignmentSolution/:courseID/:assignmentId",
  upload.single("assignmentSolution"),
  (req, res) =>
    studentAssignmentController.updateAssignmentSolution(req, res, storage)
);
/*DONE*/
router.post("/doRequest/:courseID", studentAssignmentController.doRequest);

/*  ************************** ASSIGNMENTS END **************************   */

/*  ************************** QUIZ START **************************   */

/*DONE*/
router.post("/quiz/:courseID", upload.single("quiz"), (req, res) =>
  studentQuizController.uploadQuiz(req, res, storage)
);
/*DONE*/
router.get("/quizzes/:courseID", studentQuizController.allQuizzes);
/*DONE*/
router.get("/quiz/:courseID/:quizTitle", studentQuizController.getQuiz);
/*DONE*/
router.post(
  "/quizSolution/:courseID/:quizTitle",
  upload.single("quizSolution"),
  (req, res) => studentQuizController.uploadQuizSolution(req, res, storage)
);
/*DONE*/
router.delete("/quiz/:courseID/:quizTitle", studentQuizController.deleteQuiz);
/*DONE*/
router.patch("/quiz/:courseID/:quizTitle", upload.single("quiz"), (req, res) =>
  studentQuizController.updateQuiz(req, res, storage)
);
/*DONE*/
router.delete(
  "/quizSolution/:courseID/:quizTitle",
  studentQuizController.deleteQuizSolution
);
/*DONE*/
router.patch(
  "/quizSolution/:courseID/:quizTitle",
  upload.single("quizSolution"),
  (req, res) => studentQuizController.updateQuizSolution(req, res, storage)
);

/*  ************************** QUIZ END **************************   */

/*  ************************** PAST-PAPER START **************************   */

/*DONE*/
router.post(
  "/pastPaper/:courseID",
  upload.single("pastpaper"),
  (req, res) => studentPastPaperController.uploadPastPaper(req, res, storage)
);

/*DONE*/
router.delete(
  "/pastPaper/:courseID",
  studentPastPaperController.deletePastPaper
);
/*DONE*/
router.patch("/pastPaper/:courseID", upload.single("pastPaper"), (req, res) =>
  studentPastPaperController.updatePastPaper(req, res, storage)
);
/*DONE*/
router.get("/pastPapers/:courseID", studentPastPaperController.allPastPaper);
/*DONE*/
router.get(
  "/pastPaper/:courseID/:title",
  studentPastPaperController.getPastPaper
);
/*DONE*/
router.post(
  "/pastPaperSolution/:courseID/:title",
  upload.single("pastPaperSolution"),
  (req, res) =>
    studentPastPaperController.uploadPastPaperSolution(req, res, storage)
);
/*DONE*/
router.patch(
  "/pastPaperSolution/:courseID/:title",
  upload.single("pastPaperSolution"),
  (req, res) =>
    studentPastPaperController.updatePastPaperSolution(req, res, storage)
);

router.delete(
  "/pastPaperSolution/:courseID/:title",
  studentPastPaperController.deletePastPaperSolution
);

/*  ************************** PAST-PAPER END **************************   */

/*  ************************** STUDENT START **************************   */

router.get("/student/:studentID", studentInformationController.getStudent);



/*  ************************** STUDENT END **************************   */

module.exports = router;
