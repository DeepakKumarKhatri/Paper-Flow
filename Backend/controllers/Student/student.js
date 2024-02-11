const Student = require("../../models/student");
const Bookmarks = require("../../models/bookmarks");

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
      res.send({ status: "OK", data: student.studentBookmarks });
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
      const { title, uploadedByUser, url } = req.body;
      const existingBookmark = await Bookmarks.findOne({
        title: title,
      });

      if (!existingBookmark) {
        const newBookmark = { title, uploadedByUser, url };
        const bookmark = await Bookmarks.create(newBookmark);
        student.studentBookmarks.push(bookmark._id);
        await student.save();

        res.send({ status: "OK" });
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
      const bookmarkId = req.body.objectID;
      student.studentBookmarks = student.studentBookmarks.filter(
        (bookmark) => bookmark._id.toString() !== bookmarkId
      );
      console.log(student.studentBookmarks)
      await student.save();
      await Bookmarks.findByIdAndDelete(bookmarkId);
      res.send({ status: "OK" });
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
