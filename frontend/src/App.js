import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <React.Fragment>
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
    </React.Fragment>
  );
};

export default App;
