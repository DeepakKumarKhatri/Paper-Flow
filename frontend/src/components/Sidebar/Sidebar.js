import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IoPeopleCircleSharp, IoPersonSharp } from "react-icons/io5";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSetActiveTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
      <div className={styles.sidebar_header}>
        {sidebarOpen ? (
          <FaTimes className={styles.toggle_button} onClick={toggleSidebar} />
        ) : (
          <FaBars className={styles.toggle_button} onClick={toggleSidebar} />
        )}
        <h2>Sidebar</h2>
      </div>

      <ul className={styles.sidebar_menu}>
        <Link
          to={"/courses"}
          className={`${styles.headings} ${
            activeTab === "Courses" ? styles.active : ""
          }`}
          onClick={() => handleSetActiveTab("Courses")}
        >
          <li>
            <AiIcons.AiFillHome />
            <span>Courses</span>
          </li>
        </Link>
        <Link
          className={`${styles.headings} ${
            activeTab === "My Solutions" ? styles.active : ""
          }`}
          onClick={() => handleSetActiveTab("My Solutions")}
        >
          <li>
            <IoIcons.IoIosPaper />
            <span>Contributions</span>
          </li>
        </Link>

        <Link
          className={`${styles.headings} ${
            activeTab === "My Bookmarks" ? styles.active : ""
          }`}
          onClick={() => handleSetActiveTab("My Bookmarks")}
        >
          <li>
            <IoIcons.IoIosSave />
            <span>Bookmarks</span>
          </li>
        </Link>

        <Link
          className={`${styles.headings} ${
            activeTab === "Messages" ? styles.active : ""
          }`}
          onClick={() => handleSetActiveTab("Messages")}
        >
          <li>
            <FaIcons.FaEnvelopeOpenText />
            <span>Messages</span>
          </li>
        </Link>

        <Link
          className={`${styles.headings} ${
            activeTab === "Leaderboard" ? styles.active : ""
          }`}
          onClick={() => handleSetActiveTab("Leaderboard")}
        >
          <li>
            <IoPeopleCircleSharp />
            <span>Leaderboard</span>
          </li>
        </Link>

        <Link
          className={`${styles.headings} ${
            activeTab === "About Creator" ? styles.active : ""
          }`}
          onClick={() => handleSetActiveTab("About Creator")}
        >
          <li>
            <IoPersonSharp />
            <span>About Creator</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
