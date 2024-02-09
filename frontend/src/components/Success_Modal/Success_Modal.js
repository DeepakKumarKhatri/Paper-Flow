import React from "react";
import styles from "../Success_Modal/Success_Modal.module.css";

const Success_Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Success!</h2>
        <p>Document uploaded successfully.</p>
        <p>
          Thank you so much for this contribution. Your document soon will be
          accepted by the admin.
        </p>
      </div>
    </div>
  );
};

export default Success_Modal;
