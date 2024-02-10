import React, { useState } from "react";
import styles from "../Document_Form/Document_Form.module.css";
import { years } from "../../configs/years";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Success_Modal from "../../components/Success_Modal/Success_Modal";

const Document_Form = () => {
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const [instructor, setInstructor] = useState("");
  const [solutionType, setSolutionType] = useState("");
  const { courseID } = useParams();
  const location = useLocation();
  const [student, setStudent] = useState(location?.state?.student);
  const [assignmentTitle, setAssignmentTitle] = useState(
    location?.state?.assignment
  );
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [comingFrom, setComingFrom] = useState(location?.state?.comingFrom);

  const getUrl = () => {
    switch (solutionType) {
      case "Assignment":
        return `http://localhost:8000/student/assignment/${courseID}`;
      case "Quiz":
        return `http://localhost:8000/student/quiz/${courseID}`;
      case "PastPaper":
        return `http://localhost:8000/student/pastPaper/${courseID}`;
      case "AssignmentSolution":
        return `http://localhost:8000/student/assignmentSolution/${courseID}/${assignmentTitle}`;
      case "QuizSolution":
        return `http://localhost:8000/student/quizSolution/${courseID}`;
      case "PastPaperSolution":
        return `http://localhost:8000/student/pastPaperSolution/${courseID}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("semester", semester);
    formData.append("instructor", instructor);
    formData.append("studentEmail", student.email);

    switch (solutionType) {
      case "Assignment":
        formData.append("assignment", file);
        break;
      case "Quiz":
        formData.append("quiz", file);
        break;
      case "PastPaper":
        formData.append("pastpaper", file);
        break;
      case "AssignmentSolution":
        formData.append("assignmentSolution", file);
        formData.append("title", assignmentTitle);
        break;
      case "QuizSolution":
        formData.append("quizSolution", file);
        formData.append("title", assignmentTitle);
        break;
      case "PastPaperSolution":
        formData.append("pastPaperSolution", file);
        formData.append("title", assignmentTitle);
        break;
      default:
        break;
    }

    try {
      const response = await fetch(getUrl(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.status === "OK") {
        setShowSuccessModal(true);
      }
      console.log("Success:", data);

      // setSemester('');
      // setSolutionType('');
      // setInstructor('');
      // setFile(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mapping object for options based on comingFrom value
  const optionsMap = {
    Courses: ["Assignment", "Quiz", "Past Paper"],
    Assignment: ["Assignment Solution"],
    Quiz: ["Quiz Solution"],
    "Past-Paper": ["Past Paper Solution"],
  };

  // Get options based on comingFrom value
  const options = optionsMap[comingFrom] || [];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Contribute Your Collection Here 👇</h2>
      <p>
        <strong>Note: </strong>After careful checking our admin will approve
        your contribution. We can't guarantee about every upload.
      </p>
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
            Document Type:
          </label>
          <select
            id="solutionType"
            value={solutionType}
            onChange={(e) => setSolutionType(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">Select Type</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
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

        <button
          type="submit"
          className={`${styles.submit_button} ${
            loading ? styles.shimmer_animation : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      <Success_Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default Document_Form;
