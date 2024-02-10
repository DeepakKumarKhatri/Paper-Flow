import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";

const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
