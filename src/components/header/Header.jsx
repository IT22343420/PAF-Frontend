import React, { useState, useEffect } from "react";
import { SiEducative } from "react-icons/si";
import { GoHomeFill } from "react-icons/go";
import { MdNotificationsActive } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { Offcanvas, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationPanel from "../notifications/NotificationPanel";
import NotificationService from "../../services/NotificationService";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      setError(null);
      try {
        const response = await NotificationService.getAllNotifications();
        setNotifications(response.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleClearNotification = async (id) => {
    const originalNotifications = [...notifications];
    setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));

    try {
      await NotificationService.deleteNotification(id);
    } catch (err) {
      console.error(`Error deleting notification ${id}:`, err);
      setNotifications(originalNotifications);
      alert("Failed to delete notification. Please try again.");
    }
  };

  const handleClearAllNotifications = async () => {
    const originalNotifications = [...notifications];
    setNotifications([]);

    try {
      await NotificationService.deleteAllNotifications();
    } catch (err) {
      console.error("Error deleting all notifications:", err);
      setNotifications(originalNotifications);
      alert("Failed to clear notifications. Please try again.");
    }
  };

  const handleClosePanel = () => setShowPanel(false);
  const handleShowPanel = () => setShowPanel(true);

  return (
    <>
      <div className="flex flex-row justify-between items-center px-[15%] w-max-[1200px] h-20 shadow-md bg-white sticky-top">
        <div className="flex flex-row items-center">
          <SiEducative className="text-3xl text-indigo-600 mr-4 cursor-pointer" onClick={() => navigate("/")} />
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="bg-gray-100 h-9 w-70 rounded-md pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="flex flex-row items-center space-x-8">
          <GoHomeFill
            className={`text-2xl cursor-pointer ${currentPath === "/" ? "text-indigo-600" : "text-gray-600"} hover:text-indigo-600`}
            onClick={() => navigate("/")}
            title="Home"
          />
          <div className="relative cursor-pointer" onClick={handleShowPanel} title="Notifications">
            <MdNotificationsActive 
                className="text-2xl text-gray-600 hover:text-indigo-600"
            />
            {!loadingNotifications && !error && notifications.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6em'}}>
                  {notifications.length}
                  <span className="visually-hidden">unread messages</span>
              </span>
            )}
          </div>
          <FaUserCircle
            className={`text-2xl cursor-pointer ${currentPath === "/profile" ? "text-indigo-600" : "text-gray-600"} hover:text-indigo-600`}
            onClick={() => navigate("/profile")}
            title="Profile"
          />
        </div>
      </div>

      <NotificationPanel 
        show={showPanel} 
        handleClose={handleClosePanel}
        notifications={notifications}
        onClearNotification={handleClearNotification}
        onClearAllNotifications={handleClearAllNotifications}
      />
    </>
  );
}

export default Header;
