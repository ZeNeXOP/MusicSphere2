import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NotificationOverlay from "../components/notificationoverlay";
import { FaBell, FaArrowLeft, FaUser } from "react-icons/fa6";
import ProfileOverlay from "../components/profileoverlay";
import { useAuth } from "@contexts/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifications = [
    { message: "New song released: Blinding lights by the weeknd" },
    { message: "You have a new follower: @musicfan123" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <FaArrowLeft size={20} />
          </button>

          <button onClick={() => navigate("/")}>Home</button>

          <div className="relative">
            <button onClick={() => setIsNotifOpen(true)} className="relative">
              <FaBell size={20} />
              {notifications.length > 0 && <span>{notifications.length}</span>}
            </button>
            <NotificationOverlay
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              notifications={notifications}
            />
          </div>
          <button onClick={() => navigate("/recommendationsystem")}>
            RecomSys
          </button>
          <button onClick={() => navigate("/search")}>Search</button>
          <button onClick={() => navigate("/DirectMessages")}>DM</button>
          <div className="relative">
            <button onClick={() => setIsProfileOpen(true)} className="relative">
              <FaUser size={20} />
            </button>
            <ProfileOverlay
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
          <button onClick={handleLogout}>Logout</button>
          {/* <Link to="/" className="mx-4 hover:underline">
            Home
          </Link>
          <Link to="/search" className="mx-4 hover:underline">
            Search
          </Link> */}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
