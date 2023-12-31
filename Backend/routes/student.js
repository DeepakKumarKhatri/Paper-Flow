var express = require("express");
var router = express.Router();
var studentController = require("../controllers/student");

router.get("/", studentController.studentDashboad);
router.get("/assignments/:courseID", studentController.allAssignments);
router.get("/assignment/:courseID/:assignmentId", studentController.getAssignment);

router.get("/assignmentSolutions/:courseID", studentController.allAssignmentsSolution);
router.get("/assignmentSolution/:courseID/:assignmentId", studentController.getAssignmentSolution);

router.get("/pastPapers/:courseID", studentController.allPastPaper);
router.get("/pastPaper/:courseID/:year", studentController.getPastPaper);

router.get("/quizzes/:courseID", studentController.allQuizzes);
router.get("/quiz/:courseID/:quizId", studentController.getQuiz);

router.post("/assignment/:courseID", studentController.requestAssignment);
router.post("/assignment/:courseID/:assignmentId", studentController.uploadAssignment);
router.delete("/assignment/:courseID/:assignmentId", studentController.deleteAssignment);
router.patch("/assignment/:courseID/:assignmentId", studentController.updateAssignment);

router.post("/assignmentSolution/:courseID", studentController.requestAssignmentSolution);
router.post("/assignmentSolution/:courseID/:assignmentId", studentController.uploadAssignmentSolution);
router.delete("/assignmentSolution/:courseID/:assignmentId", studentController.deleteAssignmentSolution);
router.patch("/assignmentSolution/:courseID/:assignmentId", studentController.updateAssignmentSolution);

router.post("/pastPaper/:courseID", studentController.requestPastPaper);
router.post("/pastPaper/:courseID/:year", studentController.uploadPastPaper);
router.delete("/pastPaper/:courseID/:year", studentController.deletePastPaper);
router.patch("/pastPaper/:courseID/:year", studentController.updatePastPaper);

router.post("/quiz/:courseID", studentController.requestQuiz);
router.post("/quiz/:courseID/:quizId", studentController.uploadQuiz);
router.post("/quizSolution/:courseID", studentController.requestQuizSolution);
router.post("/quizSolution/:courseID/:quizId", studentController.uploadQuizSolution);
router.delete("/quiz/:courseID/:quizId", studentController.deleteQuiz);
router.delete("/quizSolution/:courseID/:quizId", studentController.deleteQuizSolution);
router.patch("/quiz/:courseID/:quizId", studentController.updateQuiz);
router.patch("/quizSolution/:courseID/:quizId", studentController.updateQuizSolution);

module.exports = router;
