import React, { useState } from "react";
import { FaAngleDown, FaAngleUp, FaBars, FaTimes } from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

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
          className={`${styles.headings} ${
            activeTab === "Home" ? styles.active : ""
          }`}
          onClick={() => handleSetActiveTab("Home")}
        >
          <li>
            <AiIcons.AiFillHome />
            <span>Home</span>
          </li>
        </Link>
        <Link
          className={`${styles.headings} ${
            activeTab === "About" ? styles.active : ""
          }`}
          onClick={() => handleSetActiveTab("About")}
        >
          <li>
            <IoIcons.IoMdPeople />
            <span>About Creator</span>
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
        <li className={styles.dropdown}>
          <button
            className={`${styles.dropdown_toggle} ${styles.headings}`}
            onClick={toggleDropdown}
          >
            <span>Services</span>
            {dropdownVisible ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          <ul
            className={`${styles.dropdown_menu} ${
              dropdownVisible ? styles.active : ""
            }`}
          >
            <Link
              className={`${styles.headings} ${
                activeTab === "Service 1" ? styles.active : ""
              }`}
              onClick={() => handleSetActiveTab("Service 1")}
            >
              <li>
                <IoIcons.IoIosPaper />
                <span>Service 1</span>
              </li>
            </Link>
            <Link
              className={`${styles.headings} ${
                activeTab === "Service 2" ? styles.active : ""
              }`}
              onClick={() => handleSetActiveTab("Service 2")}
            >
              <li>
                <IoIcons.IoIosPaper />
                <span>Service 2</span>
              </li>
            </Link>
            <Link
              className={`${styles.headings} ${
                activeTab === "Service 3" ? styles.active : ""
              }`}
              onClick={() => handleSetActiveTab("Service 3")}
            >
              <li>
                <IoIcons.IoIosPaper />
                <span>Service 3</span>
              </li>
            </Link>
          </ul>
        </li>
        <Link
          className={`${styles.headings} ${
            activeTab === "Contact" ? styles.active : ""
          }`}
          onClick={() => handleSetActiveTab("Contact")}
        >
          <li>Contact</li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
