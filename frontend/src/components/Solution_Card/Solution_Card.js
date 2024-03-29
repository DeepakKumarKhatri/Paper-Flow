import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Solution_Card.module.css";
import { getDate } from "../../helpers/getDate";
import { filterName } from "../../helpers/filterName";
import { secureLink } from "../../helpers/secureLink";

const Solution_Card = ({ assignment, cardType }) => {
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

  return assignment !== undefined ? (
    <div className={styles["courses-container"]} key={assignment._id}>
      <h4 className={styles["assignment-heading"]}>
        Title: {filterName(assignment.solutionFileName)}
      </h4>
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
    </div>
  ) : null;
};

export default Solution_Card;
