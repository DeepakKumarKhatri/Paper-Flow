import React, { useState } from "react";
import Bookmark_Card from "../../components/Bookmark_Card/Bookmark_Card";
import { UseUserCourses } from "../../context/UserCourses";
import styles from "../Bookmarks/Bookmarks.module.css";

const Bookmarks = () => {
  const userCourses = UseUserCourses();
  const [studentInformation, setStudentInformation] = useState(
    userCourses?.userCourses.studentData || []
  );
  const isBookmarked = (documentID) => {
    return studentInformation?.studentBookmarks?.includes(
      documentID.toString()
    );
  };

  return (
    <div>
      {userCourses?.userCourses.assignmentData?.map(
        ({ courseID, courseName, assignments, quizzes, pastPapers }) => (
          <div className={styles["main-container"]} key={courseID}>
            <h2 className={styles["course-id"]}>
              Course: {courseID} {courseName}
            </h2>
            <div className={styles["all-container"]}>
              {assignments.assignments.length > 0 && (
                <div
                  className={styles["section-container"]}
                  key={`${courseID}-assignments`}
                >
                  {assignments.assignments.map(
                    (assignment) =>
                      isBookmarked(assignment._id) && (
                        <Bookmark_Card
                          key={assignment._id}
                          document={assignment}
                          studentInformation={studentInformation}
                        />
                      )
                  )}
                </div>
              )}
              {quizzes.quizzes.length > 0 && (
                <div
                  className={styles["section-container"]}
                  key={`${courseID}-quizzes`}
                >
                  {quizzes.quizzes.map(
                    (quiz) =>
                      isBookmarked(quiz._id) && (
                        <Bookmark_Card
                          key={quiz._id}
                          document={quiz}
                          studentInformation={studentInformation}
                        />
                      )
                  )}
                </div>
              )}
              {pastPapers.pastPapers.length > 0 && (
                <div
                  className={styles["section-container"]}
                  key={`${courseID}-pastPapers`}
                >
                  {pastPapers.pastPapers.map(
                    (pastPaper) =>
                      isBookmarked(pastPaper._id) && (
                        <Bookmark_Card
                          key={pastPaper._id}
                          document={pastPaper}
                          studentInformation={studentInformation}
                        />
                      )
                  )}
                  <div className={styles["button-container"]}></div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Bookmarks;
