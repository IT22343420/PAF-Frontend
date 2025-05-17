import React from "react";
import { SiEducative } from "react-icons/si";
import { IoIosHome, IoIosNotifications, IoIosSearch, IoIosPerson } from "react-icons/io";
import { Input } from "antd";

import { useLocation, useNavigate } from "react-router-dom";

const { Search } = Input;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex items-center justify-between px-4 h-16 bg-[#2c3e50] text-white shadow-md">
      {/* Left section: Logo and Site Name */}
      <div className="flex items-center">
        <SiEducative className="text-3xl text-indigo-400 mr-2" />
        <span className="text-xl font-semibold">SkillSphere</span>
      </div>

      {/* Center section: Search Bar */}
      <div className="flex-grow flex justify-center mx-4">
        <Search
          placeholder="search"
          allowClear
          style={{ width: 400 }}
        />
      </div>

      {/* Right section: Icons */}
      <div className="flex items-center space-x-6">
        <IoIosHome
          className={`text-2xl cursor-pointer ${currentPath === "/" ? "text-indigo-400" : "text-gray-200"} hover:text-indigo-400`}
          onClick={() => navigate("/")}
        />
        <IoIosNotifications className="text-2xl cursor-pointer text-gray-200 hover:text-indigo-400" />
        <IoIosSearch className="text-2xl cursor-pointer text-gray-200 hover:text-indigo-400" />
        <IoIosPerson
          className={`text-2xl cursor-pointer ${currentPath === "/profile" ? "text-indigo-400" : "text-gray-200"} hover:text-indigo-400`}
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
}

export default Header;
