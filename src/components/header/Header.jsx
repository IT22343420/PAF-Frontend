import React, { useState } from "react";
import { SiEducative } from "react-icons/si";
import { GoHomeFill } from "react-icons/go";
import { MdNotificationsActive } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { Offcanvas, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationPanel from "../notifications/NotificationPanel";

// Sample notifications (replace with actual data fetching)
const initialNotifications = [
    { id: 1, title: 'New Post Liked', description: 'John Doe liked your recent post about React.', createdAt: new Date(Date.now() - 1000 * 60 * 2) }, // 2 minutes ago
    { id: 2, title: 'Friend Request', description: 'Jane Smith wants to connect.', createdAt: new Date(Date.now() - 1000 * 60 * 15) }, // 15 minutes ago
    { id: 3, title: 'Comment Received', description: 'Alice commented: "Great insights!"', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1) }, // 1 hour ago
    { id: 4, title: 'New Post by Connection', description: 'Bob Williams shared an article: "The Future of AI".', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) }, // 3 hours ago
    { id: 5, title: 'Profile Update', description: 'You successfully updated your profile picture.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8) }, // 8 hours ago
    { id: 6, title: 'Comment Liked', description: 'Charlie Brown liked your comment on Bob\'s post.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) }, // 1 day ago
    { id: 7, title: 'New Post by Connection', description: 'Diana Prince shared a project update.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26) }, // 26 hours ago
    { id: 8, title: 'New Post Liked', description: 'Jane Smith liked your photo.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) }, // 2 days ago
    { id: 9, title: 'System Update', description: 'New messaging features are now available.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) }, // 3 days ago
    { id: 10, title: 'Comment Received', description: 'Bob Williams replied to your comment: "Thanks!"', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 90) }, // 90 hours ago
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showPanel, setShowPanel] = useState(false);

  const handleClearNotification = (id) => {
      setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
      setNotifications([]);
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
            {notifications.length > 0 && (
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
