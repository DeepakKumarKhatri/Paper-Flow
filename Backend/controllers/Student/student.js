const Student = require("../../models/student");

const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentID);
    if (student) {
      const studentWithoutPassword = { ...student.toObject() };
      delete studentWithoutPassword.password;

      res.send({ data: studentWithoutPassword });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentID);
    if (student) {
      res.send({ data: student.studentBookmarks });
    } else {
      res.status(404).send({ message: "Student not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const addBookmarks = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentID);
    if (student) {
      const objectID = req.body.objectID;
      const existing = student.studentBookmarks.find(
        (id) => id.toString() === objectID
      );
      if (!existing) {
        student.studentBookmarks.push(objectID);
        await student.save();
        res.send({ status: "OK" });
      } else {
        res.send({ message: "Already Exists" });
      }
    } else {
      res.status(404).send({ message: "Student not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteBookmarks = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentID);
    if (student) {
      const objectID = req.body.objectID;
      const index = student.studentBookmarks.indexOf(objectID);
      if (index !== -1) {
        student.studentBookmarks.splice(index, 1);
        await student.save();
        res.send({ status: "OK" });
      } else {
        res.status(404).send({ message: "Bookmark not found" });
      }
    } else {
      res.status(404).send({ message: "Student not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getStudent,
  addBookmarks,
  deleteBookmarks,
  getBookmarks,
};
