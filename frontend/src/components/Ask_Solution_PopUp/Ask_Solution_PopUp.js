import React from "react";
import styles from "../Ask_Solution_PopUp/Ask_Solution_PopUp.module.css";

const Ask_Solution_PopUp = ({ onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <div className={styles.popupContent}>
          <button className={` ${styles["upload-btn"]}`}>
            Upload a Solution
          </button>

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
