import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Courses from "./screens/Courses/Courses";
import Contact from "./screens/Contact/Contact";
import DocumentComp from "./screens/Document/Document";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DocumentSolution from "./screens/PopUp/PopUp";
import Document_Form from "./screens/Document_Form/Document_Form";
import Bookmarks from "./screens/Bookmarks/Bookmarks";
import { UserCoursesProvider } from "./context/UserCourses";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/document",
        element: <DocumentComp />,
      },
      {
        path: "/solution",
        element: <DocumentSolution />,
      },
      {
        path: "/form/:courseID",
        element: <Document_Form />,
      },
      {
        path: "/bookmarks",
        element: <Bookmarks />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserCoursesProvider>
    <RouterProvider router={appRouter} />
  </UserCoursesProvider>
);
