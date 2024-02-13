import React, { useState } from "react";
import styles from "../Bookmark_Card/Bookmark_Card.module.css";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";

const Bookmark_Card = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };
  return (
    <div className={styles.courses_container}>
      <div className={styles.titleContainer}>
        <h4 className={styles.assignment_heading}>Title:</h4>
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
      <p className={styles.assignment_details}>Instructor:</p>
      <p className={styles.assignment_details}>Uploaded by: </p>
      <p className={styles.assignment_details}>Uploaded on:</p>
    </div>
  );
};

export default Bookmark_Card;
