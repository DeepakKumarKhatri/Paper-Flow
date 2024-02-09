const mongoose = require("mongoose");
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

module.exports = {
  getStudent,
};
