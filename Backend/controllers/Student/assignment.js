const Assignment = require("../../models/assignment");
const Course = require("../../models/course");
const formatDateNow = require("../../helpers/formattedDate");
const MaterialSolution = require("../../models/materialSolution");
const mongoose = require("mongoose");
const Student = require("../../models/student");
const UserRequest = require("../../models/userRequest");

const {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");

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
    const jsonResponse1 = { message: "NO DATA FOUND" };
    const jsonResponse2 = { data: response };
    const jsonResponse = response.length === 0 ? jsonResponse1 : jsonResponse2;
    res.send({ jsonResponse });
  } catch (error) {
    res.send({ message: error });
  }
};

const uploadAssignment = async (req, res, storage) => {
  try {
    const studentEmail = req.body.studentEmail;
    const instructor = req.body.instructor;
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
      uploadedByUser: student._id,
      instructor: instructor,
      assignmentSolutions: [],
      url: downloadURL,
    });

    // Ensure the 'assignments' array is initialized before pushing
    if (!course.assignments) {
      course.assignments = [];
    }

    // Push the assignment into the 'assignments' array
    course.assignments.push(assignmentResponse);
    student.uploadedAssignments.push(assignmentResponse);

    // Save the course & student
    await course.save();
    await student.save();

    res.status(201).json({ status: "OK" });
  } catch (error) {
    return res.status(400).send(error.message);
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

const uploadAssignmentSolution = async (req, res, storage) => {
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
    const populatedAssignments = await Promise.all(
      course.assignments.map(async (assignment) => {
        const assignmentDocument = await Assignment.findById(assignment._id);
        return assignmentDocument.toObject();
      })
    );

    // Find the assignment with the specified title
    const assignmentToUpdate = populatedAssignments.find(
      (assignment) => assignment.title === req.params.title
    );

    if (!assignmentToUpdate) {
      res.json({
        status: "error",
        message: "Assignment not found for this course",
      });
      return;
    }

    /* PUSH SOLUTION FILE TO SERVER */
    const fileName = Date.now() + "_" + req.file.originalname + "_Solution";

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

    /* PUSH SOLUTION FILE TO SERVER */

    const assignmentFind = await Assignment.findOne({
      title: req.params.title,
    });

    // Ensure the 'assignmentsSolution' array is initialized before pushing
    if (!assignmentFind.assignmentSolutions) {
      assignmentFind.assignmentSolutions = [];
    }

    // Use the same _id for both AssignmentSolution and MaterialSolution
    const solutionId = new mongoose.Types.ObjectId();

    const dataToSave = {
      _id: solutionId,
      url: downloadURL,
      solutionFileName: fileName,
      uploadedByUser: student._id,
    };

    assignmentFind.assignmentSolutions.push(dataToSave);
    student.uploadedSolutions.push(dataToSave);

    // Create the assignmentSolution in MaterialSolution Entity with the same _id
    await MaterialSolution.create(dataToSave);

    // Save the assignment and student
    await assignmentFind.save();
    await student.save();

    res.status(201).json({ status: "OK" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

/**
 * Retrieves the solution for a specific assignment in a course.
 */
const getAssignmentSolution = async (req, res) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.courseID });

    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found" });
      return;
    }

    const populatedAssignments = await Promise.all(
      course.assignments.map(async (assignment) => {
        const assignmentDocument = await Assignment.findById(assignment._id);
        return assignmentDocument.toObject();
      })
    );

    const assignmentToUpdate = populatedAssignments.find(
      (assignment) => assignment.title === req.params.title
    );

    if (!assignmentToUpdate) {
      res.status(404).json({
        status: "error",
        message: "Assignment not found for this course",
      });
      return;
    }

    const assignmentFind = await Assignment.findOne({
      title: req.params.title,
    });

    const assignmentSolution = await Promise.all(
      assignmentFind.assignmentSolutions.map(async (assignmentSol) => {
        const assignmentSolutionDocument = await MaterialSolution.findById(
          assignmentSol._id
        );
        return assignmentSolutionDocument.toObject();
      })
    );

    res.status(200).json({ data: assignmentSolution });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/**
 * Deletes an assignment from a student's account.
 */
const deleteAssignment = async (req, res) => {
  try {
    const { studentEmail } = req.body;

    // Find the student document using the email
    const student = await Student.findOne({ email: studentEmail });

    if (!student) {
      // If the student is not valid, send an error response and return
      res.json({ status: "error", message: "Student not valid" });
      return;
    }

    // Fetch complete assignment data for each assignment ID
    const populatedAssignments = await Promise.all(
      student.uploadedAssignments.map(async (assignment) => {
        const assignmentDocument = await Assignment.findById(assignment._id);
        return assignmentDocument.toObject();
      })
    );

    // Remove the assignment with the matching title from the list of assignments
    const modifiedStudentAssignments = populatedAssignments.filter(
      (assignment) => assignment.title !== req.params.title
    );

    // Update the student's uploadedAssignments property with the modified list of assignments
    student.uploadedAssignments = modifiedStudentAssignments;
    await student.save();

    // Remove the user access from the assignment by setting uploadedByUser to null
    const assignment = await Assignment.findOne({ title: req.params.title });
    assignment.uploadedByUser = null;
    await assignment.save();

    // Send a success response with status code 201
    res.status(201).json({ status: "OK" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

/**
 * User will only be allowed to update the assignment document, instructor name and title
 */
const updateAssignment = async (req, res, storage) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.courseID });
    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found" });
      return;
    }

    const populatedAssignments = await Promise.all(
      course.assignments.map(async (assignment) => {
        const assignmentDocument = await Assignment.findById(assignment._id);
        return assignmentDocument.toObject();
      })
    );

    const assignmentToUpdate = populatedAssignments.find(
      (assignment) => assignment.title === req.params.title
    );

    if (!assignmentToUpdate) {
      res.status(404).json({
        status: "error",
        message: "Assignment not found for this course",
      });
      return;
    }

    const assignmentFind = await Assignment.findOne({
      title: req.params.title,
    });

    /* NOW DELETE THE PREVIOUS DOCUMENT FROM SERVER */

    // Extracting the filename from the URL
    const urlParts = assignmentFind.url.split("/");
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

    const newStorageRef = ref(storage, `Assignments/${newFileName}`);

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
    await Assignment.findOneAndUpdate(
      { title: req.params.title },
      {
        title: newFileName,
        assignmentDate: formatDateNow(),
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

/* It will require assignmentSolution Title from the user that specific document clicked
What it needs:
1) Body -> studentEmail, assignmentSolutionTitle
*/
const deleteAssignmentSolution = async (req, res) => {
  try {
    const studentEmail = req.body.studentEmail;
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      res.json({ status: "error", message: "Student not valid" });
      return;
    }
    const assignmentSolutionTitle = req.body.assignmentSolutionTitle;
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
        .json({ status: "error", message: "Assignment solution not found" });
      return;
    }

    const updatedSolutions = uploadedSolutions.filter(
      (element) => element.solutionFileName !== assignmentSolutionTitle
    );

    student.uploadedSolutions = updatedSolutions;

    await MaterialSolution.findOneAndUpdate(
      { solutionFileName: assignmentSolutionTitle },
      { uploadedByUser: null }
    );

    student.save();
    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAssignmentSolution = async (req, res, storage) => {
  try {
    const studentEmail = req.body.studentEmail;
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      res.json({ status: "error", message: "Student not valid" });
      return;
    }
    const assignmentSolutionTitle = req.body.assignmentSolutionTitle;
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
        .json({ status: "error", message: "Assignment solution not found" });
      return;
    }

    const thatSpecificSolution = uploadedSolutions.filter(
      (element) => element.solutionFileName === assignmentSolutionTitle
    );

    /* NOW DELETE THE PREVIOUS DOCUMENT FROM SERVER */

    // Extracting the filename from the URL
    const urlParts = thatSpecificSolution[0].url.split("/");
    const fileNameWithParams = decodeURIComponent(
      urlParts[urlParts.length - 1]
    );
    const fileName = fileNameWithParams.split("?")[0]; // Exclude query parameters
    console.log(fileName);
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, fileName);

    // Delete the file
    await deleteObject(storageRef);

    /* NOW DELETE THE PREVIOUS DOCUMENT FROM SERVER */

    /* ADD NEW DOCUMENT THEN UPDATE THE ASSIGNMENT SOLUTION OBJECT WITH NEW PROPERTIES */

    const newFileName = Date.now() + "_" + req.file.originalname;

    const newStorageRef = ref(storage, `Assignments/${newFileName}`);

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
      { solutionFileName: assignmentSolutionTitle },
      {
        solutionFileName: newFileName,
        url: downloadURL,
        approvedByAdmin: false,
      }
    );

    res.status(200).json({ status: "OK" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error" });
  }
};

const doRequest = async (req, res) => {
  try {
    const requestType = req.body.requestType;
    const requestMessage = req.body.requestMessage;

    const course = await Course.findOne({ courseCode: req.params.courseID });
    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found" });
      return;
    }
    const student = await Student.findOne({ email: req.body.studentEmail });
    if (!student) {
      res.status(404).json({ status: "error", message: "Student not found" });
      return;
    }

    const request = {
      requestType,
      requestMessage,
    };

    await UserRequest.create(request);

    if (!course.userRequests) {
      course.userRequests = [];
    }
    course.userRequests.push(request);

    if (!student.userRequests) {
      student.userRequests = [];
    }
    student.userRequests.push(request);

    course.save();
    student.save();

    res.status(200).json({ status: "OK" });
  } catch (error) {}
};

module.exports = {
  uploadAssignment,
  updateAssignmentSolution,
  deleteAssignmentSolution,
  updateAssignment,
  deleteAssignment,
  uploadAssignmentSolution,
  doRequest,
  getAssignmentSolution,
  getAssignment,
  allAssignments,
};
