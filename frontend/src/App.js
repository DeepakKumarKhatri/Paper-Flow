import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [assignmentNumber, setAssignmentNumber] = useState(0);
  const [assignmentDate, setAssignmentDate] = useState("");
  const [assignmentFileName, setAssignmentFileName] = useState("");
  const [assignmentSolution, setAssignmentSolution] = useState([]);

  const [allImage, setAllImage] = useState([]);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    const result = await axios.get(
      "http://localhost:8000/student/assignments/54"
    );
    setAllImage(result.data.message);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const result = await axios.post(
        "http://localhost:8000/student/assignment/4/4",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(result.data);

      if (result.data.message === "Assignment uploaded successfully") {
        alert("Uploaded Successfully!!!");
        setTitle("");
        setFile("");
        getPdf();
      } else {
        console.error("Error uploading assignment:", result.data.message);
      }
    } catch (error) {
      console.error("Error uploading assignment:", error.message);
    }
  };

  const showPdf = (pdf) => {
    window.open(
      `http://localhost:8000/assignments/${pdf}`,
      "_blank",
      "noreferrer"
    );
  };

  return (
    <div className="App" onSubmit={submitImage}>
      <form className="formStyle">
        <h4>Upload Pdf in React</h4>
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          className="form-control"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          type="text"
          className="form-control"
          placeholder="Assignment Number"
          required
          onChange={(e) => setAssignmentNumber(e.target.value)}
        />

        <input
          type="datetime"
          className="form-control"
          placeholder="Assignment Date"
          required
          onChange={(e) => setAssignmentDate(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
      <div className="uploaded">
        <h4>Uploaded PDF:</h4>
        <div className="output-div">
          {allImage == null
            ? ""
            : allImage.map((data) => {
                return (
                  <div className="inner-div" key={data.title}>
                    <h6>Title: {data.title}</h6>
                    <button
                      className="btn btn-primary"
                      onClick={() => showPdf(data.pdf)}
                    >
                      Show Pdf
                    </button>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default App;
