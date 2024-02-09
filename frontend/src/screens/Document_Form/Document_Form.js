import React, { useState } from "react";
import styles from "../Document_Form/Document_Form.module.css";
import { years } from "../../configs/years";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Document_Form = () => {
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const [instructor, setInstructor] = useState("");
  const [solutionType, setSolutionType] = useState("");
  const { courseID } = useParams();
  const location = useLocation();
  const [student, setStudent] = useState(location?.state?.student);

  const getUrl = () => {
    switch (solutionType) {
      case "Assignment":
        return `http://localhost:8000/student/assignment/${courseID}`;
      case "Quiz":
        return `http://localhost:8000/student/quiz/${courseID}`;
      case "PastPaper":
        return `http://localhost:8000/student/pastPaper/${courseID}`;;
      case "AssignmentSolution":
        return ``;
      case "QuizSolution":
        return ``;
      case "PastPaperSolution":
        return ``;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("semester", semester);
    formData.append("instructor", instructor);
    formData.append("studentEmail", student.email);
    solutionType === "Assignment" && formData.append("assignment", file);
    solutionType === "Quiz" && formData.append("quiz", file);
    solutionType === "PastPaper" && formData.append("pastpaper", file);

    try {
      const response = await fetch(getUrl(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);

      // Clear form fields after successful submission
      // setSemester('');
      // setSolutionType('');
      // setInstructor('');
      // setFile(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Assignment Form</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form_group}>
          <label htmlFor="semester" className={styles.label}>
            Semester:
          </label>
          <select
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">
              Select Semester in which assignment was assigned
            </option>
            {years.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.form_group}>
          <label htmlFor="solutionType" className={styles.label}>
            Solution Type:
          </label>
          <select
            id="solutionType"
            value={solutionType}
            onChange={(e) => setSolutionType(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">Select Type</option>
            <option value="Assignment">Assignment</option>
            <option value="Quiz">Quiz</option>
            <option value="PastPaper">Past Paper</option>
            <option value="AssignmentSolution">Assignment Solution</option>
            <option value="QuizSolution">Quiz Solution</option>
            <option value="PastPaperSolution">Past Paper Solution</option>
          </select>
        </div>

        <div className={styles.form_group}>
          <label htmlFor="instructor" className={styles.label}>
            Instructor:
          </label>
          <input
            type="text"
            id="instructor"
            placeholder="Instructor name who gave assigned you the assignment"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label htmlFor="file" className={styles.label}>
            File:
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
            className={styles.file_input}
            required
          />
        </div>

        <button type="submit" className={styles.submit_button}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Document_Form;
