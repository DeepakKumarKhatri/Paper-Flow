var express = require("express");
var router = express.Router();
var adminAssignmentController = require("../controllers/Admin/assignment");
var adminQuizController = require("../controllers/Admin/quiz");
var adminPastPaperController = require("../controllers/Admin/pastpaper");
var adminCourseController = require("../controllers/Admin/course");

router.get("/", adminPastPaperController.adminDashboad);
router.get("/assignments/:courseID", adminAssignmentController.allAssignments);
router.get("/assignmentSolutions/:courseID", adminAssignmentController.allAssignmentsSolution);
router.get("/pastPapers/:courseID", adminPastPaperController.allPastPaper);
router.get("/quizzes/:courseID", adminQuizController.allQuizzes);

router.delete("/assignment/:courseID/:assignmentId", adminAssignmentController.deleteAssignment);
router.delete("/assignmentSolution/:courseID/:assignmentId", adminAssignmentController.deleteAssignmentSolution);
router.delete("/pastPaper/:courseID/:year", adminPastPaperController.deletePastPaper);

router.delete("/quiz/:courseID/:quizId", adminQuizController.deleteQuiz);
router.delete("/quizSolution/:courseID/:quizId", adminQuizController.deleteQuizSolution);

router.post("/addCourse/:id", adminCourseController.addCourse);
router.delete("/course/:id", adminCourseController.removeCourse);

router.get("/unapprovedAssignments", adminAssignmentController.unapprovedAssignments);
router.get("/unapprovedAssignmentSolutions", adminAssignmentController.unapprovedAssignmentSolutions);
router.get("/unapprovedPastPapers", adminPastPaperController.unapprovedPastPapers);
router.get("/unapprovedQuizzes", adminQuizController.unapprovedQuizzes);
router.get("/unapprovedQuizzesSolutions", adminQuizController.unapprovedQuizzesSolutions);

router.post("/addAssignment/:id", adminAssignmentController.addAssignment);
router.post("/addAssignmentSolution/:id", adminAssignmentController.addAssignmentSolution);
router.post("/addPastPaper/:id", adminPastPaperController.addPastPaper);
router.post("/addQuiz/:id", adminQuizController.addQuiz);
router.post("/addQuizSolution/:id", adminQuizController.addQuizSolution);

module.exports = router;
