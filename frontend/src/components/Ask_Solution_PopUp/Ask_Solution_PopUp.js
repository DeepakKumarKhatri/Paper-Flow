import React, { useEffect } from "react";
import styles from "../Ask_Solution_PopUp/Ask_Solution_PopUp.module.css";
import { Link } from "react-router-dom";

const Ask_Solution_PopUp = ({
  onClose,
  title,
  courseId,
  assignment,
  student,
  cardType,
}) => {
  
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <div className={styles.popupContent}>
          <h3 className={styles.noSolutionFound}>
            No Solution Found for {title}
          </h3>
          <Link
            to={`/form/${courseId}`}
            state={{
              assignment: assignment,
              student: student,
              comingFrom: cardType,
            }}
          >
            <button className={` ${styles["upload-btn"]}`}>
              Upload a Solution
            </button>
          </Link>

          <button className={` ${styles["request-btn"]}`}>
            Request a Solution
          </button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default Ask_Solution_PopUp;
