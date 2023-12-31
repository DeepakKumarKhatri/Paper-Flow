var express = require("express");
var router = express.Router();
var adminController = require("../controllers/admin");

router.get("/", adminController.adminDashboad);
router.get("/assignments/:courseID", adminController.allAssignments);
router.get("/assignmentSolutions/:courseID", adminController.allAssignmentsSolution);
router.get("/pastPapers/:courseID", adminController.allPastPaper);
router.get("/quizzes/:courseID", adminController.allQuizzes);

router.delete("/assignment/:courseID/:assignmentId", adminController.deleteAssignment);
router.delete("/assignmentSolution/:courseID/:assignmentId", adminController.deleteAssignmentSolution);
router.delete("/pastPaper/:courseID/:year", adminController.deletePastPaper);

router.delete("/quiz/:courseID/:quizId", adminController.deleteQuiz);
router.delete("/quizSolution/:courseID/:quizId", adminController.deleteQuizSolution);

router.post("/course", adminController.addCourse);
router.delete("/course", adminController.removeCourse);

router.get("/unapprovedAssignments", adminController.unapprovedAssignments);
router.get("/unapprovedAssignmentSolutions", adminController.unapprovedAssignmentSolutions);
router.get("/unapprovedPastPapers", adminController.unapprovedPastPapers);
router.get("/unapprovedQuizzes", adminController.unapprovedQuizzes);
router.get("/unapprovedQuizzesSolutions", adminController.unapprovedQuizzesSolutions);

router.post("/addAssignment/:id", adminController.addAssignment);
router.post("/addAssignmentSolution/:id", adminController.addAssignmentSolution);
router.post("/addCourse/:id", adminController.addCourse);
router.post("/addPastPaper/:id", adminController.addPastPaper);
router.post("/addQuiz/:id", adminController.addQuiz);
router.post("/addQuizSolution/:id", adminController.addQuizSolution);

module.exports = router;
