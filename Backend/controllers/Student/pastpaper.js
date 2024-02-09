const PastPaper = require("../../models/pastPaper");
const Course = require("../../models/course");
const MaterialSolution = require("../../models/materialSolution");
const mongoose = require("mongoose");
const Student = require("../../models/student");

const {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");

const studentDashboad = async (req, res) => {
  res.end("Welcome Student Dashboad");
};

const uploadPastPaper = async (req, res, storage) => {
  try {
    const studentEmail = req.body.studentEmail;
    const semester = req.body.semester;
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

    const storageRef = ref(storage, `PastPapers/${fileName}`);

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
    const pastPaperResponse = await PastPaper.create({
      title: fileName,
      semester: semester,
      fileType: req.file.mimetype,
      uploadedByUser: student._id,
      instructor: instructor,
      pastPaperSolutions: [],
      url: downloadURL,
    });

    // Ensure the 'PAST-PAPER' array is initialized before pushing
    if (!course.pastPapers) {
      course.pastPapers = [];
    }

    // Push the PAST-PAPER into the 'PAST-PAPER' array
    course.pastPapers.push(pastPaperResponse);
    student.uploadedPastPapers.push(pastPaperResponse);

    // Save the course & student
    await course.save();
    await student.save();

    res.status(201).json({ status: "OK" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const deletePastPaper = async (req, res) => {
  try {
    const studentEmail = req.body.studentEmail;

    // Find the student document using the email
    const student = await Student.findOne({ email: studentEmail });

    if (!student) {
      // If the student is not valid, send an error response and return
      res.json({ status: "error", message: "Student not valid" });
      return;
    }

    // Fetch complete quiz data for each PAST-PAPER ID
    const populatedPastPapers = await Promise.all(
      student.uploadedPastPapers.map(async (pastPaper) => {
        const pastPaperDocument = await PastPaper.findById(pastPaper._id);
        return pastPaperDocument.toObject();
      })
    );

    const modifiedStudentPastPapers = populatedPastPapers.filter(
      (pastPaper) => pastPaper.title !== req.body.title
    );

    // Update the student's uploaded quiz property with the modified list of assignments
    student.uploadedPastPapers = modifiedStudentPastPapers;
    await student.save();

    // Update the user access from the past paper by setting uploadedByUser to null
    const updateResult = await PastPaper.updateMany(
      { title: req.body.title },
      { uploadedByUser: null }
    );

    if (updateResult.nModified === 0) {
      // If no documents were modified, the past paper might not exist
      res
        .status(404)
        .json({ status: "error", message: "Past paper not found" });
      return;
    }

    // Send a success response with status code 201
    res.status(201).json({ status: "OK" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const updatePastPaper = async (req, res, storage) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.courseID });
    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found" });
      return;
    }

    const populatedPastPapers = await PastPaper.find({
      _id: { $in: course.pastPapers },
    })
      .populate({
        path: "pastPaperSolutions",
        populate: {
          path: "uploadedByUser",
          model: "Student",
        },
      })
      .exec();

    const pastPaperToUpdate = populatedPastPapers.find(
      (pastPaper) => pastPaper.title === req.body.title
    );

    if (!pastPaperToUpdate) {
      res.status(404).json({
        status: "error",
        message: "Quiz not found for this course",
      });
      return;
    }

    const pastPaperFind = await PastPaper.findOne({
      title: req.body.title,
    });

    // /* NOW DELETE THE PREVIOUS DOCUMENT FROM SERVER */

    // // Extracting the filename from the URL
    const urlParts = pastPaperFind.url.split("/");
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

    const newStorageRef = ref(storage, `PastPapers/${newFileName}`);

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
    await PastPaper.findOneAndUpdate(
      { title: req.body.title },
      {
        title: newFileName,
        semester: req.body.semester,
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

const allPastPaper = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseID });
    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found" });
      return;
    }

    const populatedPastPapers = await PastPaper.find({
      _id: { $in: course.pastPapers },
    })
      .populate({
        path: "pastPaperSolutions",
        populate: {
          path: "uploadedByUser",
          model: "Student",
        },
      })
      .exec();

    res.status(200).json({ status: "OK", data: populatedPastPapers });
  } catch (error) {
    res.status(400).json({ error: "Error" });
  }
};

const getPastPaper = async (req, res) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.courseID });
    if (!course) {
      res.status(404).json({ status: "error", message: "Course not found" });
      return;
    }

    const populatedPastPapers = await PastPaper.find({
      _id: { $in: course.pastPapers },
    })
      .populate({
        path: "pastPaperSolutions",
        populate: {
          path: "uploadedByUser",
          model: "Student",
        },
      })
      .exec();

    const specificPastPaper = populatedPastPapers.find(
      (pastPaper) => pastPaper.title === req.params.title
    );

    if (!specificPastPaper) {
      res.status(404).json({
        status: "error",
        message: "Past-Paper not found for this course",
      });
      return;
    }

    res.status(200).json({ status: "OK", data: specificPastPaper });
  } catch (error) {
    res.status(400).json({ error: "Error" });
  }
};

const uploadPastPaperSolution = async (req, res, storage) => {
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
    const populatedPastPapers = await PastPaper.find({
      _id: { $in: course.pastPapers },
    })
      .populate({
        path: "pastPaperSolutions",
        populate: {
          path: "uploadedByUser",
          model: "Student",
        },
      })
      .exec();

    // Find the quiz with the specified title
    const pastPaperToUpdate = populatedPastPapers.find(
      (pastPaper) => pastPaper.title === req.body.title
    );

    if (!pastPaperToUpdate) {
      res.json({
        status: "error",
        message: "PastPaper not found for this course",
      });
      return;
    }

    console.log(pastPaperToUpdate)

    /* PUSH SOLUTION FILE TO SERVER */
    const fileName = Date.now() + "_" + req.file.originalname + "_Solution";

    const storageRef = ref(storage, `PastPapers/${fileName}`);

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
    if (!pastPaperToUpdate.pastPaperSolutions) {
      pastPaperToUpdate.pastPaperSolutions = [];
    }

    // Use the same _id for both AssignmentSolution and MaterialSolution
    const solutionId = new mongoose.Types.ObjectId();

    const dataToSave = {
      _id: solutionId,
      url: downloadURL,
      solutionFileName: fileName,
      uploadedByUser: student._id,
    };

    pastPaperToUpdate.pastPaperSolutions.push(dataToSave);
    student.uploadedSolutions.push(dataToSave);

    // Create the assignmentSolution in MaterialSolution Entity with the same _id
    await MaterialSolution.create(dataToSave);

    // Save the assignment and student
    await pastPaperToUpdate.save();
    await student.save();

    res.status(201).json({ status: "OK" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const updatePastPaperSolution = async (req, res, storage) => {
  try {
    const studentEmail = req.body.studentEmail;
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      res.json({ status: "error", message: "Student not valid" });
      return;
    }
    const pastPaperSolutionTitle = req.body.pastPaperSolutionTitle;
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
      (element) => element.solutionFileName === pastPaperSolutionTitle
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

    const newStorageRef = ref(storage, `PastPapers/${newFileName}`);

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
      { solutionFileName: pastPaperSolutionTitle },
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

const deletePastPaperSolution = async (req, res) => {
  try {
    const studentEmail = req.body.studentEmail;
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      res.json({ status: "error", message: "Student not valid" });
      return;
    }
    const pastPaperSolutionTitle = req.body.pastPaperSolutionTitle;
    const uploadedSolutions = await Promise.all(
      student.uploadedSolutions.map(async (solution) => {
        const quizDocument = await MaterialSolution.findById(solution._id);
        return quizDocument.toObject();
      })
    );

    if (!uploadedSolutions) {
      res
        .status(404)
        .json({ status: "error", message: "PastPaper solution not found" });
      return;
    }

    const updatedSolutions = uploadedSolutions.filter(
      (element) => element.solutionFileName !== pastPaperSolutionTitle
    );

    student.uploadedSolutions = updatedSolutions;

    const response = await MaterialSolution.findOneAndUpdate(
      { solutionFileName: pastPaperSolutionTitle },
      { uploadedByUser: null }
    );

    student.save();
    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  studentDashboad,
  uploadPastPaper,
  updatePastPaper,
  deletePastPaper,
  allPastPaper,
  getPastPaper,
  uploadPastPaperSolution,
  deletePastPaperSolution,
  updatePastPaperSolution,
};
