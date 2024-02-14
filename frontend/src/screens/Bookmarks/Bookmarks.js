import React, { useState, useMemo } from "react";
import Bookmark_Card from "../../components/Bookmark_Card/Bookmark_Card";
import { UseUserCourses } from "../../context/UserCourses";
import styles from "../Bookmarks/Bookmarks.module.css";
import { filterName } from "../../helpers/filterName";

const Bookmarks = () => {
  const userCourses = UseUserCourses();
  const [searchTerm, setSearchTerm] = useState("");

  const studentInformation = useMemo(
    () => userCourses?.userCourses.studentData || [],
    [userCourses?.userCourses.studentData]
  );

  const isBookmarked = (documentID) => {
    return studentInformation?.studentBookmarks?.includes(
      documentID.toString()
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourseAssignments = useMemo(() => {
    return userCourses?.userCourses.assignmentData?.filter(
      ({ assignments, quizzes, pastPapers }) => {
        const combinedContent = assignments.assignments.concat(
          quizzes.quizzes,
          pastPapers.pastPapers
        );
        return combinedContent.some((item) => {
          const filteredTitle = filterName(item.title).toLowerCase();
          return (
            filteredTitle.includes(searchTerm.toLowerCase()) &&
            isBookmarked(item._id)
          );
        });
      }
    );
  }, [userCourses?.userCourses.assignmentData, searchTerm]);

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
      {filteredCourseAssignments?.map(
        ({ courseID, courseName, assignments, quizzes, pastPapers }) => {
          const bookmarkedAssignments = assignments.assignments.reduce(
            (acc, assignment) => {
              if (isBookmarked(assignment._id)) {
                acc.push(assignment);
              }
              return acc;
            },
            []
          );
          const bookmarkedQuizzes = quizzes.quizzes.reduce((acc, quiz) => {
            if (isBookmarked(quiz._id)) {
              acc.push(quiz);
            }
            return acc;
          }, []);
          const bookmarkedPapers = pastPapers.pastPapers.reduce(
            (acc, paper) => {
              if (isBookmarked(paper._id)) {
                acc.push(paper);
              }
              return acc;
            },
            []
          );

          if (
            bookmarkedAssignments.length > 0 ||
            bookmarkedQuizzes.length > 0 ||
            bookmarkedPapers.length > 0
          ) {
            return (
              <div className={styles.mainContainer} key={courseID}>
                <h2 className={styles.courseId}>
                  Course: {courseID} {courseName}
                </h2>
                <div className={styles.allContainer}>
                  {bookmarkedAssignments.map((assignment) => (
                    <Bookmark_Card
                      key={assignment._id}
                      document={assignment}
                      studentInformation={studentInformation}
                    />
                  ))}
                  {bookmarkedQuizzes.map((quiz) => (
                    <Bookmark_Card
                      key={quiz._id}
                      document={quiz}
                      studentInformation={studentInformation}
                    />
                  ))}
                  {bookmarkedPapers.map((paper) => (
                    <Bookmark_Card
                      key={paper._id}
                      document={paper}
                      studentInformation={studentInformation}
                    />
                  ))}
                </div>
              </div>
            );
          }
          return null;
        }
      )}
    </div>
  );
};

export default Bookmarks;
