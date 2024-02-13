const getUserCourses = async (userID) => {
  try {
    const data = await fetch(
      `http://localhost:8000/student/allCourses/${userID}`
    );
    if (!data.ok) {
      throw new Error("Failed to fetch user courses");
    }
    const json = await data.json();
    return {
      detailedCourses: json.detailedCourses,
      studentData: json.studentData,
    };
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return [];
  }
};

const getAssignments = async (courseID) => {
  try {
    const data = await fetch(
      `http://localhost:8000/student/assignments/${courseID}`
    );
    const json = await data.json();
    return {
      courseID: json.data.courseCode,
      courseName: json.data.courseName,
      assignments: json.data.data,
    };
  } catch (error) {
    console.error("Error fetching user assignments:", error);
    return {};
  }
};

const getQuizzes = async (courseID) => {
  try {
    const data = await fetch(
      `http://localhost:8000/student/quizzes/${courseID}`
    );
    const json = await data.json();
    return {
      courseID: json.data.courseCode,
      courseName: json.data.courseName,
      quizzes: JSON.parse(JSON.stringify(json)).data,
    };
  } catch (error) {
    console.error("Error fetching user quizzes:", error);
    return {};
  }
};

const getPastPapers = async (courseID) => {
  try {
    const data = await fetch(
      `http://localhost:8000/student/pastPapers/${courseID}`
    );
    const json = await data.json();
    return {
      courseID: json.data.courseCode,
      courseName: json.data.courseName,
      pastPapers: json.data,
    };
  } catch (error) {
    console.error("Error fetching user pastPapers:", error);
    return {};
  }
};

export const getUserCoursesData = async () => {
  const { detailedCourses, studentData } = await getUserCourses(
    "65a93843aec24ba21ae373b5"
  );
  const courses = detailedCourses;
  const assignmentData = await Promise.all(
    courses.map(async (course) => ({
      courseID: course.courseCode,
      courseName: course.courseName,
      assignments: await getAssignments(course._id),
      quizzes: await getQuizzes(course._id),
      pastPapers: await getPastPapers(course._id),
    }))
  );
  return {
    assignmentData,
    studentData,
  };
};
