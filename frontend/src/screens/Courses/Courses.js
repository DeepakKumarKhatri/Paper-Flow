import React, { useState, useEffect } from "react";
import styles from "../Courses/Courses.module.css";
import AQP_Card from "../../components/AQP_Cards/AQP_Card";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [studentInformation, setStudentInformation] = useState(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const [numberOfItemsToShow, setNumberOfItemsToShow] = useState(3);

  const getUserCourses = async () => {
    try {
      const data = await fetch(
        `http://localhost:8000/student/allCourses/${"65a93843aec24ba21ae373b5"}`
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

  useEffect(() => {
    const fetchData = async () => {
      const { detailedCourses, studentData } = await getUserCourses();
      setStudentInformation(studentData);
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
      setCourseAssignments(assignmentData);
    };
    fetchData();
  }, []);

  const handleShowMore = () => {
    setShowAllItems(true);
    setNumberOfItemsToShow((prev) => prev + 3);
  };

  const handleShowLess = () => {
    setShowAllItems(false);
    setNumberOfItemsToShow(3);
  };

  return (
    <div>
      <h1 className={styles["courses-heading"]}>YOUR COURSES</h1>
      {courseAssignments.map(
        ({ courseID, courseName, assignments, quizzes, pastPapers }) => (
          <div className={styles["main-container"]} key={courseID}>
            <h2 className={styles["course-id"]}>
              Course: {courseID} {courseName}
            </h2>
            <Link
              title={"Upload a solution"}
              to={`/form/${courseID}`}
              state={{ student: studentInformation }}
              className={styles.contributionMessage}
            >
              Have anything to contribute?
            </Link>
            <div className={styles["all-container"]}>
              {assignments.assignments.length > 0 && (
                <div className={styles["section-container"]}>
                  <h2 className={styles["tags-recognize"]}>
                    AVAILABLE ASSIGNMENTS
                  </h2>
                  {assignments.assignments
                    .slice(0, numberOfItemsToShow)
                    .map((assignment) => (
                      <AQP_Card
                        assignment={assignment}
                        cardType={"Assignment"}
                        courseId={courseID}
                        key={assignment._id}
                        student={studentInformation}
                      />
                    ))}
                  <div className={styles["button-container"]}>
                    {assignments.assignments.length > numberOfItemsToShow && (
                      <button
                        className={styles["show-more-button"]}
                        onClick={handleShowMore}
                      >
                        Show More
                      </button>
                    )}
                    {showAllItems && (
                      <button
                        className={styles["show-less-button"]}
                        onClick={handleShowLess}
                      >
                        Show Less
                      </button>
                    )}
                  </div>
                </div>
              )}
              {quizzes.quizzes.length > 0 && (
                <div className={styles["section-container"]}>
                  <h2 className={styles["tags-recognize"]}>
                    AVAILABLE QUIZZES
                  </h2>
                  {quizzes.quizzes.slice(0, numberOfItemsToShow).map((quiz) => (
                    <AQP_Card
                      assignment={quiz}
                      key={quiz._id}
                      courseId={courseID}
                      cardType={"Quiz"}
                      student={studentInformation}
                    />
                  ))}
                  <div className={styles["button-container"]}>
                    {assignments.assignments.length > numberOfItemsToShow && (
                      <button
                        className={styles["show-more-button"]}
                        onClick={handleShowMore}
                      >
                        Show More
                      </button>
                    )}
                    {showAllItems && (
                      <button
                        className={styles["show-less-button"]}
                        onClick={handleShowLess}
                      >
                        Show Less
                      </button>
                    )}
                  </div>
                </div>
              )}
              {pastPapers.pastPapers.length > 0 && (
                <div className={styles["section-container"]}>
                  <h2 className={styles["tags-recognize"]}>
                    AVAILABLE PAST PAPERS
                  </h2>
                  {pastPapers.pastPapers
                    .slice(0, numberOfItemsToShow)
                    .map((pastPaper) => (
                      <AQP_Card
                        assignment={pastPaper}
                        key={pastPaper._id}
                        courseId={courseID}
                        cardType={"Past-Paper"}
                        student={studentInformation}
                      />
                    ))}
                  <div className={styles["button-container"]}>
                    {assignments.assignments.length > numberOfItemsToShow && (
                      <button
                        className={styles["show-more-button"]}
                        onClick={handleShowMore}
                      >
                        Show More
                      </button>
                    )}
                    {showAllItems && (
                      <button
                        className={styles["show-less-button"]}
                        onClick={handleShowLess}
                      >
                        Show Less
                      </button>
                    )}
                  </div>
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
