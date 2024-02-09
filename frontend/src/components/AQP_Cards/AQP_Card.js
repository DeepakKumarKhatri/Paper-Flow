import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDate } from "../../helpers/getDate";
import { filterName } from "../../helpers/filterName";
import { secureLink } from "../../helpers/secureLink";
import DocumentSolution from "../../screens/PopUp/PopUp";
import styles from "./AQP_Cards.module.css";
import Ask_Solution_PopUp from "../Ask_Solution_PopUp/Ask_Solution_PopUp";

const AQP_Card = ({ assignment, cardType }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState([]);

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

  return (
    <div className={styles["courses-container"]} key={assignment._id}>
      <h4 className={styles["assignment-heading"]}>
        Title: {filterName(assignment.title)}
      </h4>
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
        className={`${styles["assignment-btn"]} ${styles["solutions-btn"]}`}
        onClick={handleOpenPopup}
      >
        Available Solutions:{" "}
        {assignment?.assignmentSolutions?.length !== undefined
          ? assignment?.assignmentSolutions?.length
          : 0}
      </button>
      {showPopup && assignment?.assignmentSolutions?.length > 0 ? (
        <DocumentSolution
          solutionFiles={assignment.assignmentSolutions}
          cardType={cardType}
          onClose={handleClosePopup}
        />
      ) : (
        showPopup && <Ask_Solution_PopUp onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default AQP_Card;
