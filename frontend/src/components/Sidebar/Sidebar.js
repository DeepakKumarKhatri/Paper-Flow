import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import {
  IoPeopleCircleSharp,
  IoPersonSharp,
  IoNotificationsSharp,
  IoSettings,
  IoCaretDown,
  IoCaretUp,
  IoAccessibilitySharp,
  IoLogOut,
} from "react-icons/io5";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import sidebar_logo from "../../assets/images/sidebar_logo.png";
import { UseUserCourses } from "../../context/UserCourses";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userData = UseUserCourses();

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        toggleSidebar();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [sidebarOpen]);

  return (
    <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
      <div className={styles.sidebar_header}>
        {sidebarOpen ? (
          <FaTimes
            title="Or Press ESC key"
            className={styles.toggle_button}
            onClick={toggleSidebar}
          />
        ) : (
          <FaBars
            title="Or Press ESC key"
            className={styles.toggle_button}
            onClick={toggleSidebar}
          />
        )}
        <Link to={"/courses"}>
          <img
            className={styles.logo}
            src={sidebar_logo}
            draggable="false"
            alt="Logo"
          />
        </Link>
      </div>

      <ul className={styles.sidebar_menu}>
        <li>
          <div
            className={`${styles.headings} dropdown_toggle`}
            onClick={toggleUserDropdown}
          >
            <div className={styles.userToggle}>
              <div>
                <IoAccessibilitySharp />
                <span>
                  {userData?.userCourses?.studentData?.name || "User"}
                </span>
              </div>
              <>
                {userDropdownOpen ? (
                  <IoCaretUp className={styles.updownBtn} />
                ) : (
                  <IoCaretDown className={styles.updownBtn} />
                )}
              </>
            </div>
          </div>
          <ul
            className={`${styles.dropdown_menu} ${
              userDropdownOpen ? styles.active : ""
            }`}
          >
            <Link className={styles.dropdownHeadings} to="">
              <li>
                <IoPersonSharp className={styles.icon} />
                <span>View Profile</span>
              </li>
            </Link>
            <Link to="" className={styles.dropdownHeadings}>
              <li>
                <IoLogOut className={styles.icon} />
                <span>Logout</span>
              </li>
            </Link>
          </ul>
        </li>
        <Link to={"/courses"} className={styles.headings}>
          <li>
            <AiIcons.AiFillHome />
            <span>Courses</span>
          </li>
        </Link>
        <Link className={styles.headings}>
          <li>
            <IoIcons.IoIosPaper />
            <span>Contributions</span>
          </li>
        </Link>

        <Link to={"/bookmarks"} className={styles.headings}>
          <li>
            <IoIcons.IoIosSave />
            <span>Bookmarks</span>
          </li>
        </Link>

        <Link className={styles.headings}>
          <li>
            <IoNotificationsSharp />
            <span>Notifications</span>
          </li>
        </Link>

        <Link className={styles.headings}>
          <li>
            <IoPeopleCircleSharp />
            <span>Leaderboard</span>
          </li>
        </Link>

        <Link className={styles.headings}>
          <li>
            <IoSettings />
            <span>Support</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
