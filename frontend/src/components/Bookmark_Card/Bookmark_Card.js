import React, { useState } from "react";
import styles from "../Bookmark_Card/Bookmark_Card.module.css";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { UseUserCourses } from "../../context/UserCourses";
import { getDate } from "../../helpers/getDate";
import { filterName } from "../../helpers/filterName";

const Bookmark_Card = ({ document, studentInformation }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const allStudents = UseUserCourses();

  const getUser = (userID) => {
    const user = allStudents.allStudents.data.find(
      (userData) => userData._id === userID
    );
    return user ? user.name : "Admin";
  };

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };
  return (
    <div className={styles.courses_container}>
      <div className={styles.titleContainer}>
        <h4 className={styles.assignment_heading}>
          Title:{filterName(document.title)}
        </h4>
        <span
          className={`${styles.bookmark} ${isBookmarked ? styles.clicked : ""}`}
          onClick={() => {
            handleBookmarkClick();
          }}
        >
          {isBookmarked ? (
            <IoBookmark title="Remove this document" />
          ) : (
            <IoBookmarkOutline title="Bookmark this document" />
          )}
        </span>
      </div>
      <p className={styles.assignment_details}>
        Instructor: {document.instructor}
      </p>
      <p className={styles.assignment_details}>
        Uploaded by: {getUser(document.uploadedByUser)}{" "}
      </p>
      <p className={styles.assignment_details}>
        Uploaded on: {getDate(document.createdAt)}
      </p>
    </div>
  );
};

export default Bookmark_Card;
