import React from "react";

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

  const openAssignmentInNewTab = (url) => {
    window.open(url, "_blank");
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
      <button
        className={styles["assignment-btn"]}
        onClick={() => {
          openAssignmentInNewTab(assignment.url);
        }}
      >
        Checkout {cardType}
      </button>
      <button
        className={`${styles["assignment-btn"]} ${styles["solutions-btn"]}`}
      >
        Available Solutions 📝
      </button>
    </div>
  );
};

export default AQP_Card;
