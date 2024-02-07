const PastPaper = require("../../models/pastPaper");
const Course = require("../../models/course");
const Student = require("../../models/student");
const Admin = require("../../models/admin");
const MaterialSolution = require("../../models/materialSolution");
const {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");

const unapprovedPastPapers = async (req, res) => {
  try {
    const response = await PastPaper.find({ approvedByAdmin: false });
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const approvePastPaper = async (req, res) => {
  try {
    await PastPaper.findOneAndUpdate(
      { title: req.params.title },
      { approvedByAdmin: true }
    );
    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const allPastPaper = async (req, res) => {
  try {
    const response = await PastPaper.find({ approvedByAdmin: true });
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePastPaperForUser = async (req, res) => {
  try {
    const pastPaperID = req.params.pastPaperID;
    const studentID = req.params.studentID;
    const student = await Student.findById(studentID);

    const pastPapersResponse = student.uploadedPastPapers.filter((id) => {
      return id._id != pastPaperID;
    });

    await PastPaper.findByIdAndUpdate(pastPaperID, {
      uploadedByUser: null,
    });

    student.uploadedPastPapers = pastPapersResponse;
    student.save();

    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePastPaperFromServer = async (req, res, storage) => {
  try {
    const pastPaperID = req.params.pastPaperID;
    const studentID = req.params.studentID;
    const student = await Student.findById(studentID);

    const pastPapersResponse = student.uploadedPastPapers.filter((id) => {
      return id._id != pastPaperID;
    });

    const pastPaperFind = await PastPaper.findById(pastPaperID);

    const urlParts = pastPaperFind.url.split("/");
    const fileNameWithParams = decodeURIComponent(
      urlParts[urlParts.length - 1]
    );
    const fileName = fileNameWithParams.split("?")[0];
    const storageRef = ref(storage, fileName);
    await deleteObject(storageRef);

    student.uploadedPastPapers = pastPapersResponse;
    await PastPaper.findByIdAndDelete(pastPaperID);
    student.save();

    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const addPastPaper = async (req, res, storage) => {
  try {
    const adminEmail = req.body.adminEmail;
    const semester = req.body.semester;
    const instructor = req.body.instructor;
    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      res.json({ status: "error", message: "Student not valid" });
      return;
    }

    const course = await Course.findOne({ courseCode: req.params.courseID });

    if (course.length === 0) {
      res.json({ status: "error", message: "Course not found" });
      return;
    }

    const fileName = Date.now() + "_" + req.file.originalname + "_" + "Admin";

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
      uploadedByUser: admin._id,
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
    admin.uploadedPastPapers.push(pastPaperResponse);

    // Save the course & student
    await course.save();
    await admin.save();

    res.status(201).json({ status: "OK" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const adminDashboad = async (req, res) => {
  res.end("Admin Dashboad");
};

module.exports = {
  adminDashboad,
  deletePastPaperForUser,
  deletePastPaperFromServer,
  allPastPaper,
  unapprovedPastPapers,
  addPastPaper,
  approvePastPaper,
};
