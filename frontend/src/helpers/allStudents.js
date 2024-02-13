export const getAllStudents = async () => {
  try {
    const data = await fetch(`http://localhost:8000/student/students`);
    if (!data.ok) {
      throw new Error("Failed to fetch user courses");
    }
    const json = await data.json();
    return json;
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return [];
  }
};
