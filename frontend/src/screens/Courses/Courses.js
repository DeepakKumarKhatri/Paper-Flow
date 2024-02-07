import React, { useState, useEffect } from "react";
import styles from "../Courses/Courses.module.css";

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
    let year = dateObject.getFullYear();
    let month = dateObject.getMonth() + 1;
    let date = dateObject.getDate();

    month = month < 10 ? '0' + month : month;
    date = date < 10 ? '0' + date : date;
    return date + "-" + month + "-" + year;
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
      <h1 className={styles["courses-heading"]}>YOUR COURSES</h1>
      {courseAssignments.map(({ courseID, courseName, assignments }) => (
        <div className={styles["main-container"]} key={courseID}>
          <h2 className={styles["course-id"]}>
            Course: {courseID} {courseName}
          </h2>
          <div className={styles["all-container"]}>
            {assignments.assignments.map((assignment) => (
              <div className={styles["courses-container"]} key={assignment._id}>
                <h4 className={styles["assignment-heading"]}>
                  {filterName(assignment.title)}
                </h4>
                <p className={styles["assignment-details"]}>
                  Instructor: {assignment.instructor}
                </p>
                <p className={styles["assignment-details"]}>
                  {getDate(assignment.updatedAt)}
                </p>
                <button
                  className={styles["assignment-btn"]}
                  onClick={() => {
                    openAssignmentInNewTab(assignment.url);
                  }}
                >
                  Checkout Assignment
                </button>
                <button
                  className={`${styles["assignment-btn"]} ${styles["solutions-btn"]}`}
                >
                  Available Solutions 📝
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Courses;
