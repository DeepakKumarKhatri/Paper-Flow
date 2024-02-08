import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Courses from "./screens/Courses/Courses";
import Contact from "./screens/Contact/Contact";
import DocumentComp from "./screens/Document/Document";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DocumentSolution from "./screens/PopUp/PopUp";

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
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
