const Quiz = require("../../models/quiz");
const Course = require("../../models/course");
const formatDateNow = require("../../helpers/formattedDate");
const MaterialSolution = require("../../models/materialSolution");
const mongoose = require("mongoose");
const Student = require("../../models/student");

const {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");

const uploadQuiz = async (req, res, storage) => {
  try {
    const studentEmail = req.body.studentEmail;
    const instructor = req.body.instructor;
    const semester = req.body.semester;
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      res.json({ status: "error", message: "Student not valid" });
      return;
    }

    const course = await Course.findOne({ courseCode: req.params.courseID });

    if (course.length === 0) {
      res.json({ status: "error", message: "Course not found" });
      return;
    }

    const fileName = Date.now() + "_" + req.file.originalname;

    const storageRef = ref(storage, `Quizzes/${fileName}`);

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
    const quizResponse = await Quiz.create({
      title: fileName,
      semester: semester,
      fileType: req.file.mimetype,
      uploadedByUser: student._id,
      instructor: instructor,
      quizSolutions: [],
      url: downloadURL,
    });

    // Ensure the 'assignments' array is initialized before pushing
    if (!course.quizzes) {
      course.quizzes = [];
    }

    // Push the assignment into the 'assignments' array
    course.quizzes.push(quizResponse);
    student.uploadedQuizzes.push(quizResponse);

    // Save the course & student
    await course.save();
    await student.save();

    res.status(201).json({ status: "OK" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const allQuizzes = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseID });

    if (!course) {
      return res
        .status(404)
        .json({ status: "error", message: "Course not found" });
    }

    let quizzes = await Quiz.find({
      _id: { $in: course.quizzes },
    });

    if (quizzes.length === 0) {
      return res.json({ message: "NO DATA FOUND", data: [] });
    }

    res.setHeader("Content-Disposition", "inline");
    res.json({ data: quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getQuiz = async (req, res) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.courseID });

    if (course.length === 0) {
      res.json({ status: "error", message: "Course not found" });
      return;
    }
    const quizResponse = Quiz.find({
      title: req.params.quizTitle,
    }).then((quiz) => {
      res.send({ data: quiz });
    });
    if (!quizResponse) {
      res.json({ status: "error", message: "Quiz not found" });
    }
  } catch (error) {
    res.send({ status: error });
  }
};

const uploadQuizSolution = async (req, res, storage) => {
  try {
    const studentEmail = req.body.studentEmail;
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      res.json({ status: "error", message: "Student not valid" });
      return;
    }

    const course = await Course.findOne({ courseCode: req.params.courseID });

    if (!course) {
      res.json({ status: "error", message: "Course not found" });
      return;
    }

    // Fetch complete assignment data for each assignment ID
    const populatedQuizzes = await Quiz.find({ _id: { $in: course.quizzes } })
      .populate({
        path: "quizSolutions",
        populate: {
          path: "uploadedByUser",
          model: "Student",
        },
      })
      .exec();

    // Find the quiz with the specified title
    const quizToUpdate = populatedQuizzes.find(
      (quiz) => quiz.title === req.params.quizTitle
    );

    if (!quizToUpdate) {
      res.json({
        status: "error",
        message: "Quiz not found for this course",
      });
      return;
    }

    /* PUSH SOLUTION FILE TO SERVER */
    const fileName = Date.now() + "_" + req.file.originalname + "_Solution";

    const storageRef = ref(storage, `Quizzes/${fileName}`);

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
    /* PUSH SOLUTION FILE TO SERVER */

    // Ensure the 'assignmentsSolution' array is initialized before pushing
    if (!quizToUpdate.quizSolutions) {
      quizToUpdate.quizSolutions = [];
    }

    // Use the same _id for both AssignmentSolution and MaterialSolution
    const solutionId = new mongoose.Types.ObjectId();

    const dataToSave = {
      _id: solutionId,
      url: downloadURL,
      solutionFileName: fileName,
      uploadedByUser: student._id,
    };

    quizToUpdate.quizSolutions.push(dataToSave);
    student.uploadedSolutions.push(dataToSave);

    // Create the assignmentSolution in MaterialSolution Entity with the same _id
    await MaterialSolution.create(dataToSave);

    // Save the assignment and student
    await quizToUpdate.save();
    await student.save();

    res.status(201).json({ status: "OK" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { studentEmail } = req.body;

    // Find the student document using the email
    const student = await Student.findOne({ email: studentEmail });

    if (!student) {
      // If the student is not valid, send an error response and return
      res.json({ status: "error", message: "Student not valid" });
      return;
    }

    // Fetch complete quiz data for each assignment ID
    const populatedAssignments = await Promise.all(
      student.uploadedQuizzes.map(async (quiz) => {
        const assignmentDocument = await Quiz.findById(quiz._id);
        return assignmentDocument.toObject();
      })
    );

    // Remove the quiz with the matching title from the list of quizzes
    const modifiedStudentAssignments = populatedAssignments.filter(
      (quiz) => quiz.title !== req.params.quizTitle
    );

    // Update the student's uploaded quiz property with the modified list of assignments
    student.uploadedQuizzes = modifiedStudentAssignments;
    await student.save();

    // Remove the user access from the quiz by setting uploadedByUser to null
    await Quiz.findOneAndUpdate(
      { title: req.params.quizTitle },
      { uploadedByUser: null }
    );

    // Send a success response with status code 201
    res.status(201).json({ status: "OK" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const updateQuiz = async (req, res, storage) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.courseID });
    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found" });
      return;
    }

    const populatedQuizzes = await Quiz.find({ _id: { $in: course.quizzes } })
      .populate({
        path: "quizSolutions",
        populate: {
          path: "uploadedByUser",
          model: "Student",
        },
      })
      .exec();

    const quizToUpdate = populatedQuizzes.find(
      (quiz) => quiz.title === req.params.quizTitle
    );

    if (!quizToUpdate) {
      res.status(404).json({
        status: "error",
        message: "Quiz not found for this course",
      });
      return;
    }

    const quizFind = await Quiz.findOne({
      title: req.params.quizTitle,
    });

    /* NOW DELETE THE PREVIOUS DOCUMENT FROM SERVER */

    // Extracting the filename from the URL
    const urlParts = quizFind.url.split("/");
    const fileNameWithParams = decodeURIComponent(
      urlParts[urlParts.length - 1]
    );
    const fileName = fileNameWithParams.split("?")[0]; // Exclude query parameters

    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, fileName);

    // Delete the file
    await deleteObject(storageRef);

    /* NOW DELETE THE PREVIOUS DOCUMENT FROM SERVER */

    /* ADD NEW DOCUMENT THEN UPDATE THE ASSIGNMENT OBJECT WITH NEW PROPERTIES */

    const newFileName = Date.now() + "_" + req.file.originalname;

    const newStorageRef = ref(storage, `Quizzes/${newFileName}`);

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      newStorageRef,
      req.file.buffer,
      metadata
    );

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);
    // Update the assignment object with new properties
    await Quiz.findOneAndUpdate(
      { title: req.params.quizTitle },
      {
        title: newFileName,
        quizDate: formatDateNow(),
        instructor: req.body.instructor,
        url: downloadURL,
        approvedByAdmin: false,
      }
    );

    /* ADD NEW DOCUMENT THEN UPDATE THE ASSIGNMENT OBJECT WITH NEW PROPERTIES */

    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(400).json({ error: "Error" });
  }
};

const deleteQuizSolution = async (req, res) => {
  try {
    const studentEmail = req.body.studentEmail;
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      res.json({ status: "error", message: "Student not valid" });
      return;
    }
    const quizSolutionTitle = req.body.quizSolutionTitle;
    const uploadedSolutions = await Promise.all(
      student.uploadedSolutions.map(async (solution) => {
        const quizDocument = await MaterialSolution.findById(solution._id);
        return quizDocument.toObject();
      })
    );

    if (!uploadedSolutions) {
      res
        .status(404)
        .json({ status: "error", message: "Assignment solution not found" });
      return;
    }

    const updatedSolutions = uploadedSolutions.filter(
      (element) => element.solutionFileName !== quizSolutionTitle
    );

    student.uploadedSolutions = updatedSolutions;

    await MaterialSolution.findOneAndUpdate(
      { solutionFileName: quizSolutionTitle },
      { uploadedByUser: null }
    );

    student.save();
    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateQuizSolution = async (req, res, storage) => {
  try {
    const studentEmail = req.body.studentEmail;
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      res.json({ status: "error", message: "Student not valid" });
      return;
    }
    const quizSolutionTitle = req.body.quizSolutionTitle;
    const uploadedSolutions = await Promise.all(
      student.uploadedSolutions.map(async (solution) => {
        const assignmentDocument = await MaterialSolution.findById(
          solution._id
        );
        return assignmentDocument.toObject();
      })
    );

    if (!uploadedSolutions) {
      res
        .status(404)
        .json({ status: "error", message: "Quiz solution not found" });
      return;
    }

    const thatSpecificSolution = uploadedSolutions.filter(
      (element) => element.solutionFileName === quizSolutionTitle
    );

    /* NOW DELETE THE PREVIOUS DOCUMENT FROM SERVER */

    // Extracting the filename from the URL
    const urlParts = thatSpecificSolution[0].url.split("/");
    const fileNameWithParams = decodeURIComponent(
      urlParts[urlParts.length - 1]
    );
    const fileName = fileNameWithParams.split("?")[0]; // Exclude query parameters
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, fileName);

    // Delete the file
    await deleteObject(storageRef);

    /* NOW DELETE THE PREVIOUS DOCUMENT FROM SERVER */

    /* ADD NEW DOCUMENT THEN UPDATE THE ASSIGNMENT SOLUTION OBJECT WITH NEW PROPERTIES */

    const newFileName = Date.now() + "_" + req.file.originalname;

    const newStorageRef = ref(storage, `Quizzes/${newFileName}`);

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      newStorageRef,
      req.file.buffer,
      metadata
    );

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);
    // Update the assignment object with new properties
    await MaterialSolution.findOneAndUpdate(
      { solutionFileName: quizSolutionTitle },
      {
        solutionFileName: newFileName,
        url: downloadURL,
        approvedByAdmin: false,
      }
    );

    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(400).json({ error: "Error" });
  }
};

module.exports = {
  uploadQuizSolution,
  uploadQuiz,
  updateQuizSolution,
  deleteQuizSolution,
  updateQuiz,
  deleteQuiz,
  allQuizzes,
  getQuiz,
};
