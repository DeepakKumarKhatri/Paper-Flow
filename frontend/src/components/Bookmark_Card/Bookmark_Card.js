import React, { useState, useEffect } from "react";
import styles from "../Bookmark_Card/Bookmark_Card.module.css";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { UseUserCourses } from "../../context/UserCourses";
import { getDate } from "../../helpers/getDate";
import { filterName } from "../../helpers/filterName";
import { Link } from "react-router-dom";
import { secureLink } from "../../helpers/secureLink";

const Bookmark_Card = ({ document, studentInformation }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const allStudents = UseUserCourses();

  useEffect(() => {
    setIsBookmarked(studentInformation.studentBookmarks.includes(document._id));
  }, [studentInformation.studentBookmarks, document._id]);

  const getUser = (userID) => {
    const user = allStudents.allStudents.data.find(
      (userData) => userData._id === userID
    );
    return user ? user.name : "Admin";
  };

  const handleBookmarkClick = async (id) => {
    try {
      const body = {
        objectID: id,
      };

      if (!isBookmarked) {
        // Add bookmark
        const response = await fetch(
          `http://localhost:8000/student/student/bookmarks/${studentInformation._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } else {
        // Remove bookmark
        const response = await fetch(
          `http://localhost:8000/student/student/bookmarks/${studentInformation._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      }
      setIsBookmarked(!isBookmarked);
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.courses_container}>
      <div className={styles.titleContainer}>
        <Link
          to={"/document"}
          state={{ urlFile: secureLink(document?.url) }}
          className={styles.linkTag}
          title="Checkout document"
        >
          <h4 className={styles.assignment_heading}>
            Title:{filterName(document.title)}
          </h4>
        </Link>
        <span
          className={`${styles.bookmark} ${isBookmarked ? styles.clicked : ""}`}
          onClick={() => {
            handleBookmarkClick(document._id);
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
