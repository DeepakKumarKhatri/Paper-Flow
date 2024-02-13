import React, { useState } from "react";
import Bookmark_Card from "../../components/Bookmark_Card/Bookmark_Card";
import { UseUserCourses } from "../../context/UserCourses";
import styles from "../Bookmarks/Bookmarks.module.css";
import { filterName } from "../../helpers/filterName";

const Bookmarks = () => {
  const userCourses = UseUserCourses();
  const [studentInformation, setStudentInformation] = useState(
    userCourses?.userCourses.studentData || []
  );
  const [searchTerm, setSearchTerm] = useState("");

  const isBookmarked = (documentID) => {
    return studentInformation?.studentBookmarks?.includes(
      documentID.toString()
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourseAssignments =
    userCourses?.userCourses.assignmentData?.filter(
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
    <div className={styles.container}>
      <div className={styles.main_head_container}>
        <h1 className={styles.courses_heading}>YOUR BOOKMARKS</h1>
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
          <div className={styles.mainContainer} key={courseID}>
            <h2 className={styles.courseId}>
              Course: {courseID} {courseName}
            </h2>
            <div className={styles.allContainer}>
              {assignments.assignments.length > 0 &&
                assignments.assignments.map(
                  (assignment) =>
                    isBookmarked(assignment._id) && (
                      <Bookmark_Card
                        key={assignment._id}
                        document={assignment}
                        studentInformation={studentInformation}
                      />
                    )
                )}
              {quizzes.quizzes.length > 0 &&
                quizzes.quizzes.map(
                  (quiz) =>
                    isBookmarked(quiz._id) && (
                      <Bookmark_Card
                        key={quiz._id}
                        document={quiz}
                        studentInformation={studentInformation}
                      />
                    )
                )}
              {pastPapers.pastPapers.length > 0 &&
                pastPapers.pastPapers.map(
                  (pastPaper) =>
                    isBookmarked(pastPaper._id) && (
                      <Bookmark_Card
                        key={pastPaper._id}
                        document={pastPaper}
                        studentInformation={studentInformation}
                      />
                    )
                )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Bookmarks;
