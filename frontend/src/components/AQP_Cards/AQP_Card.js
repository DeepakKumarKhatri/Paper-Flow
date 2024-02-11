import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDate } from "../../helpers/getDate";
import { filterName } from "../../helpers/filterName";
import { secureLink } from "../../helpers/secureLink";
import DocumentSolution from "../../screens/PopUp/PopUp";
import styles from "./AQP_Cards.module.css";
import Ask_Solution_PopUp from "../Ask_Solution_PopUp/Ask_Solution_PopUp";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";

const AQP_Card = ({ assignment, cardType, courseId, student }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getUserData = async () => {
    if (assignment.uploadedByUser !== null) {
      try {
        const data = await fetch(
          `http://localhost:8000/student/student/${assignment.uploadedByUser}`
        );
        if (!data.ok) {
          throw new Error("Failed to fetch user data");
        }
        const json = await data.json();
        setUserData((prevUserData) => [...prevUserData, json.data]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getLengthSolutions = () => {
    if (cardType === "Assignment") {
      return assignment?.assignmentSolutions?.length;
    } else if (cardType === "Quiz") {
      return assignment?.quizSolutions?.length;
    }
    if (cardType === "Past-Paper") {
      return assignment?.pastPaperSolutions?.length;
    }
  };

  const getSolutions = () => {
    if (cardType === "Assignment") {
      return assignment?.assignmentSolutions;
    } else if (cardType === "Quiz") {
      return assignment?.quizSolutions;
    }
    if (cardType === "Past-Paper") {
      return assignment?.pastPaperSolutions;
    }
  };

  const getUser = (userID) => {
    const user = userData.find((userData) => userData._id === userID);
    return user ? user.name : "Admin";
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleBookmarkClick = async (title, uploadedByUser, url, id) => {
    console.log("id: " + id)
    const user = uploadedByUser !== null ? getUser(uploadedByUser) : "Admin";
    try {
      const response = await fetch(
        `http://localhost:8000/student/student/bookmarks/${student._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      const bookmarks = responseData.data;

      const body = JSON.stringify({
        title: title,
        uploadedByUser: user,
        url: url,
        objectID: id,
      });

      const bodyDelete = JSON.stringify({
        objectID: id,
      });

      if (!isBookmarked) {
        // Check if the bookmark already exists
        const existingBookmark = bookmarks.find(
          (bookmark) =>
            bookmark.title === title &&
            bookmark.uploadedByUser === user &&
            bookmark.url === url &&
            bookmark.objectID === id
        );

        if (existingBookmark) {
          console.log("Bookmark already exists");
          return;
        }

        // If the bookmark doesn't exist, add it
        const addResponse = await fetch(
          `http://localhost:8000/student/student/bookmarks/${student._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: body,
          }
        );

        if (!addResponse.ok) {
          throw new Error("Failed to add bookmark");
        }

        console.log("Bookmark added successfully");
      } else {
        const deleteResponse = await fetch(
          `http://localhost:8000/student/student/bookmarks/${student._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: bodyDelete,
          }
        );

        if (!deleteResponse.ok) {
          throw new Error("Failed to delete bookmark");
        }

        console.log("Bookmark deleted successfully");
      }

      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles["courses-container"]} key={assignment._id}>
      <div className={styles.titleContainer}>
        <h4 className={styles["assignment-heading"]}>
          Title: {filterName(assignment.title)}
        </h4>
        <span
          className={styles.bookmark}
          onClick={() => {
            handleBookmarkClick(
              assignment.title,
              assignment.uploadedByUser,
              assignment.url,
              assignment._id
            );
          }}
        >
          {isBookmarked ? (
            <IoBookmark title="Remove this document" />
          ) : (
            <IoBookmarkOutline title="Bookmark this document" />
          )}
        </span>
      </div>
      <p className={styles["assignment-details"]}>
        Instructor: {assignment.instructor}
      </p>
      <p className={styles["assignment-details"]}>
        Uploaded by:{" "}
        {assignment.uploadedByUser !== null
          ? getUser(assignment.uploadedByUser)
          : "Admin"}
      </p>
      <p className={styles["assignment-details"]}>
        Uploaded on: {getDate(assignment.updatedAt)}
      </p>
      <Link to={"/document"} state={{ urlFile: secureLink(assignment?.url) }}>
        <button className={styles["assignment-btn"]}>
          Checkout {cardType}
        </button>
      </Link>

      <button
        className={`${styles["solutions-btn"]}`}
        onClick={handleOpenPopup}
      >
        Available Solutions:{" "}
        {getLengthSolutions() !== undefined ? getLengthSolutions() : 0}
      </button>
      {showPopup && getLengthSolutions() > 0 ? (
        <DocumentSolution
          solutionFiles={getSolutions()}
          cardType={cardType}
          onClose={handleClosePopup}
          title={assignment.title}
          courseId={courseId}
          assignment={assignment.title}
          student={student}
        />
      ) : (
        showPopup && (
          <Ask_Solution_PopUp
            onClose={handleClosePopup}
            title={filterName(assignment.title)}
            courseId={courseId}
            assignment={assignment.title}
            student={student}
            cardType={cardType}
          />
        )
      )}
    </div>
  );
};

export default AQP_Card;
