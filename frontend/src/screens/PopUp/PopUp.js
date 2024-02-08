import React, { useState, useEffect } from "react";
import styles from "../PopUp/PopUp.module.css";
import Solution_Card from "../../components/Solution_Card/Solution_Card";

const DocumentSolution = ({ solutionFiles, onClose, cardType }) => {
  console.log(solutionFiles);
  const [documentSolution, setDocumentSolution] = useState([]);

  const getSolutions = async () => {
    if (solutionFiles !== undefined) {
      const responses = await Promise.all(
        solutionFiles.map(async (solutionFile) => {
          const data = await fetch(
            `http://localhost:8000/student/assignmentSolution/${solutionFile._id}`
          );
          return data.json();
        })
      );
      setDocumentSolution(responses);
    }
  };

  useEffect(() => {
    getSolutions();
  }, []);

  const popupContentWidth = documentSolution.length > 2 ? "93vw" : "auto";

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <div
          className={styles.popupContent}
          style={{ width: popupContentWidth }}
        >
          {documentSolution
            .filter((solution) => solution !== undefined)
            .map((solution, index) => (
              <div className={styles.solutionCardContainer} key={index}>
                <p className={styles.cardNumber}>Solution {index + 1}:</p>
                <Solution_Card
                  assignment={solution.data}
                  cardType={"Solution"}
                  key={solution.data._id}
                />
              </div>
            ))}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default DocumentSolution;
