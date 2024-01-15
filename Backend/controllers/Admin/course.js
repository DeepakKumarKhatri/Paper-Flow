const addCourse = async (req, res) => {
  res.end("Add Course Route");
};

const removeCourse = async (req, res) => {
  res.end("Remove Course Route");
};

module.exports = {
  addCourse,
  removeCourse,
};
