import React from "react";
import DocumentComp from "../../screens/Document/Document";
import { Link } from "react-router-dom";
import { encryptLink } from "../../helpers/hashing";

const AQP_Card = ({ assignment, styles, cardType }) => {
  const getDate = (datee) => {
    const dateObject = new Date(datee);
    let year = dateObject.getFullYear();
    let month = dateObject.getMonth() + 1;
    let date = dateObject.getDate();

    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    return date + "-" + month + "-" + year;
  };

  const filterName = (fileName) => {
    const nameWithoutNumbersAndType = fileName.replace(/^\d+|\.pdf$/g, "");
    const nameWithoutUnderscores = nameWithoutNumbersAndType.replace(/_/g, " ");
    return nameWithoutUnderscores;
  };

  const secureLink = (url) => {
    const securedLink = encryptLink(url);
    return securedLink;
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
        Uploaded on: {getDate(assignment.updatedAt)}
      </p>
      <Link to={"/document"} state={{ urlFile: secureLink(assignment.url) }}>
        <button
          className={styles["assignment-btn"]}
        >
          Checkout {cardType}
        </button>
      </Link>
      <button
        className={`${styles["assignment-btn"]} ${styles["solutions-btn"]}`}
      >
        Available Solutions 📝
      </button>
    </div>
  );
};

export default AQP_Card;
