import React, { useState, useEffect } from "react";
import styles from "../Courses/Courses.module.css";
import AQP_Card from "../../components/AQP_Cards/AQP_Card";

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

  const getQuizzes = async (courseID) => {
    const data = await fetch(
      `http://localhost:8000/student/quizzes/${courseID}`
    );
    const json = await data.json();
    return {
      courseID: json.data.courseCode,
      courseName: json.data.courseName,
      quizzes: JSON.parse(JSON.stringify(json)).data,
    };
  };

  const getPastPapers = async (courseID) => {
    const data = await fetch(
      `http://localhost:8000/student/pastPapers/${courseID}`
    );
    const json = await data.json();
    return {
      courseID: json.data.courseCode,
      courseName: json.data.courseName,
      pastPapers: json.data,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const courses = await getUserCourses();
      const assignmentData = await Promise.all(
        courses.map(async (course) => ({
          courseID: course.courseCode,
          courseName: course.courseName,
          assignments: await getAssignments(course._id),
          quizzes: await getQuizzes(course._id),
          pastPapers: await getPastPapers(course._id),
        }))
      );
      setCourseAssignments(assignmentData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className={styles["courses-heading"]}>YOUR COURSES</h1>
      {courseAssignments.map(
        ({ courseID, courseName, assignments, quizzes, pastPapers }) => (
          <div className={styles["main-container"]} key={courseID}>
            <h2 className={styles["course-id"]}>
              Course: {courseID} {courseName}
            </h2>
            <div className={styles["all-container"]}>
              {assignments.assignments.length > 0 && (
                <div className={styles["section-container"]}>
                  <h2 className={styles["tags-recognize"]}>
                    AVAILABLE ASSIGNMENTS
                  </h2>
                  {assignments.assignments.map((assignment) => (
                    <AQP_Card
                      assignment={assignment}
                      styles={styles}
                      cardType={"Assignment"}
                      key={assignment._id}
                    />
                  ))}
                </div>
              )}
              {quizzes.quizzes.length > 0 && (
                <div className={styles["section-container"]}>
                  <h2 className={styles["tags-recognize"]}>AVAILABLE QUIZZES</h2>
                  {quizzes.quizzes.map((quiz) => (
                    <AQP_Card
                      assignment={quiz}
                      styles={styles}
                      key={quiz._id}
                      cardType={"Quiz"}
                    />
                  ))}
                </div>
              )}
              {pastPapers.pastPapers.length > 0 && (
                <div className={styles["section-container"]}>
                  <h2 className={styles["tags-recognize"]}>
                    AVAILABLE PAST PAPERS
                  </h2>
                  {pastPapers.pastPapers.map((pastPaper) => (
                    <AQP_Card
                      assignment={pastPaper}
                      styles={styles}
                      key={pastPaper._id}
                      cardType={"Past-Paper"}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );  
};

export default Courses;
