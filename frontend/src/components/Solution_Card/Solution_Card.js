import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Solution_Card.module.css";
import { getDate } from "../../helpers/getDate";
import { filterName } from "../../helpers/filterName";
import { secureLink } from "../../helpers/secureLink";

const Solution_Card = ({ assignment, cardType }) => {
  return assignment !== undefined ? (
    <div className={styles["courses-container"]} key={assignment._id}>
      <h4 className={styles["assignment-heading"]}>
        Title: {filterName(assignment.solutionFileName)}
      </h4>
      <p className={styles["assignment-details"]}>
        Uploaded by:{" "}
        {assignment.uploadedByUser !== null
          ? assignment.uploadedByUser
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
