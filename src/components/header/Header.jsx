import React from "react";
import { SiEducative } from "react-icons/si";
import { GoHomeFill } from "react-icons/go";
import { MdNotificationsActive } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { Button, Nav } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-row justify-between items-center px-[15%] w-max-[1200px] h-20 shadow-md">
      <div>
        <div className="flex flex-row justify-center items-center">
          <SiEducative className="text-3xl text-indigo-600 mr-4" />
          <input
            className="bg-gray-200 h-8 w-70 rounded-md pl-5 focus:outline-none"
            placeholder="search"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items center">
        <GoHomeFill
          className={`text-2xl cursor-pointer ${
            currentPath === "/" ? "text-indigo-600" : "text-gray-800"
          } hover:text-indigo-600`}
          onClick={() => navigate("/")}
        />
        <MdNotificationsActive className="text-2xl text-gray-800 ml-10 hover:text-indigo-600" />
        <FaSearch className="text-2xl text-gray-800 ml-10 hover:text-indigo-600" />
        <FaUserCircle
          className={`text-2xl cursor-pointer ml-10 ${
            currentPath === "/profile" ? "text-indigo-600" : "text-gray-800"
          } hover:text-indigo-600`}
          onClick={() => navigate("/profile")}
        />
        <Nav>
        <Button as={Link} to="/addPost" variant="primary">
                            Add New Post
                        </Button>
        </Nav>
        
      </div>
    </div>
  );
}

export default Header;
