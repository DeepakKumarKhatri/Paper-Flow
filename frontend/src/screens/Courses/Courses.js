import React, { useState, useEffect } from "react";

const Courses = () => {
  const [courseAssignments, setCourseAssignments] = useState([]);

  const getUserCourses = async () => {
    const data = await fetch(
      "http://localhost:8000/student/allCourses/65a93843aec24ba21ae373b5"
    );
    const json = await data.json();
    return json.detailedCourses;
  };

  const getAssignments = async (courseID) => {
    const data = await fetch(
      `http://localhost:8000/student/assignments/${courseID}`
    );
    const json = await data.json();
    return {
      courseID: json.data.courseCode,
      courseName: json.data.courseName,
      assignments: json.data.data,
    };
  };

  const getDate = (datee) => {
    const dateObject = new Date(datee);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const date = dateObject.getDate();
    return year + "-" + month + "-" + date;
  };

  const filterName = (fileName) => {
    const nameWithoutNumbersAndType = fileName.replace(/^\d+|\.pdf$/g, "");
    const nameWithoutUnderscores = nameWithoutNumbersAndType.replace(/_/g, " ");
    return nameWithoutUnderscores;
  };

  useEffect(() => {
    const fetchData = async () => {
      const courses = await getUserCourses();
      const assignmentData = await Promise.all(
        courses.map(async (course) => ({
          courseID: course.courseCode,
          courseName: course.courseName,
          assignments: await getAssignments(course._id),
        }))
      );
      setCourseAssignments(assignmentData);
    };

    fetchData();
  }, []);

  const openAssignmentInNewTab = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div>
      <h1>Courses</h1>
      {courseAssignments.map(({ courseID, courseName, assignments }) => (
        <div key={courseID}>
          <h2>Course ID: {courseID}</h2>
          <h3>Course Name: {courseName}</h3>
          {assignments.assignments.map((assignment) => (
            <div className="container" key={assignment._id}>
              <h4>{filterName(assignment.title)}</h4>
              <p>Instructor: {assignment.instructor}</p>
              <p>{getDate(assignment.updatedAt)}</p>
              <button
                onClick={() => {
                  openAssignmentInNewTab(assignment.url);
                }}
              >
                Checkout Assignment
              </button>
              <button>Available Solutions 📝</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Courses;
