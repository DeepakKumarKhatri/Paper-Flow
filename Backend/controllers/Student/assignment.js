const Assignment = require("../../models/assignment");
const Course = require("../../models/course");
const formatDateNow = require("../../helpers/formattedDate");

const {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

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
    const course = await Course.findOne({ courseCode: req.params.courseID });

    if (course.length === 0) {
      res.json({ status: "error", message: "Course not found" });
      return;
    }

    if (!course.assignments) {
      course.assignments = [];
    }
    let response = [];
    course.assignments.map((assignment) => response.push(assignment));
    console.log(response);

    res.send({ data: response });
  } catch (error) {
    res.send({ message: error });
  }
};

const getAssignment = async (req, res) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.courseID });

    if (course.length === 0) {
      res.json({ status: "error", message: "Course not found" });
      return;
    }
    const assignmentResponse = Assignment.find({
      title: req.params.title,
    }).then((assignments) => {
      res.send({ data: assignments });
    });
    if (!assignmentResponse) {
      res.json({ status: "error", message: "Assignment not found" });
    }
  } catch (error) {
    res.send({ status: error });
  }
};

const getAssignmentSolution = async (req, res) => {
  res.end("getAssignmentSolution");
};

const requestAssignment = async (req, res) => {
  res.end("Request Assignment route");
};

const requestAssignmentSolution = async (req, res) => {
  res.end("Request Assignment Solution route");
};

const uploadAssignmentSolution = async (req, res) => {
  res.end("Upload Assignment Solution");
};

const deleteAssignment = async (req, res) => {
  res.end("Delete Assignment Past Paper");
};

const updateAssignment = async (req, res) => {
  res.end("Update Assignment Past Paper");
};

const deleteAssignmentSolution = async (req, res) => {
  res.end("Delete Assignment Solution Paper");
};

const updateAssignmentSolution = async (req, res) => {
  res.end("Update AssignmentSolution Paper");
};

module.exports = {
  uploadAssignment,
  updateAssignmentSolution,
  deleteAssignmentSolution,
  updateAssignment,
  deleteAssignment,
  uploadAssignmentSolution,
  requestAssignmentSolution,
  requestAssignment,
  getAssignmentSolution,
  getAssignment,
  allAssignments,
};
