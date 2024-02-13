import { createContext, useState, useContext } from "react";

export const UserCoursesContext = createContext(null);

export const UseUserCourses = () => {
  const coursesContext = useContext(UserCoursesContext);
  return coursesContext;
};

export const UserCoursesProvider = (props) => {
  const [userCourses, setUserCourses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  return (
    <UserCoursesContext.Provider
      value={{ userCourses, setUserCourses, allStudents, setAllStudents }}
    >
      {props.children}
    </UserCoursesContext.Provider>
  );
};
