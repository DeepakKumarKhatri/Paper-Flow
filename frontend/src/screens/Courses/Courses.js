import React, { useState, useEffect } from "react";
import styles from "../Courses/Courses.module.css";
import AQP_Card from "../../components/AQP_Cards/AQP_Card";
import { Link } from "react-router-dom";
import { filterName } from "../../helpers/filterName";
import { getUserCoursesData } from "../../helpers/course";
import { UseUserCourses } from "../../context/UserCourses";
import { getAllStudents } from "../../helpers/allStudents";

const Courses = () => {
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [studentInformation, setStudentInformation] = useState(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const [numberOfItemsToShow, setNumberOfItemsToShow] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const coursesContext = UseUserCourses();

  useEffect(() => {
    const fetchData = async () => {
      const userCourses = await getUserCoursesData();
      const allStudents = await getAllStudents();
      setCourseAssignments(userCourses.assignmentData);
      setStudentInformation(userCourses.studentData);
      coursesContext.setUserCourses(userCourses);
      coursesContext.setAllStudents(allStudents);
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourseAssignments = courseAssignments.filter(
    ({ courseID, courseName, assignments, quizzes, pastPapers }) => {
      const combinedContent = assignments.assignments.concat(
        quizzes.quizzes,
        pastPapers.pastPapers
      );
      return (
        courseID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        combinedContent.some((item) => {
          const filteredTitle = filterName(item.title).toLowerCase();
          return filteredTitle.includes(searchTerm.toLowerCase());
        })
      );
    }
  );

  return (
    <div>
      <div className={styles["main-head-container"]}>
        <h1 className={styles["courses-heading"]}>YOUR COURSES</h1>
        <input
          type="text"
          placeholder="Search by course or content..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.search_input}
        />
      </div>
      {filteredCourseAssignments.map(
        ({ courseID, courseName, assignments, quizzes, pastPapers }) => (
          <div className={styles["main-container"]} key={courseID}>
            <h2 className={styles["course-id"]}>
              Course: {courseID} {courseName}
            </h2>
            <Link
              title={"Upload a solution"}
              to={`/form/${courseID}`}
              state={{ student: studentInformation, comingFrom: "Courses" }}
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
