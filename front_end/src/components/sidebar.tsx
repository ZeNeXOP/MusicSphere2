import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHouse,
  FaUser,
  FaMusic,
  FaChartSimple,
  FaBars,
  FaXmark,
  FaMagnifyingGlass,
  FaBookBookmark,
  FaPlus,
  FaSignOutAlt,
  FaClockRotateLeft,
} from "react-icons/fa6";
import { useAuth } from "@contexts/AuthContext";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";

const navLinks = [
  { label: "Home", icon: <FaHouse />, path: "/" },
  { label: "Search", icon: <FaMagnifyingGlass />, path: "/search" },
  { label: "Library", icon: <FaBookBookmark />, path: "/library" },
  { label: "History", icon: <FaClockRotateLeft />, path: "/history" },
  { label: "Upload", icon: <FaPlus />, path: "/upload" },
  { label: "Stats", icon: <FaChartSimple />, path: "/dashboard/statistics" },
];

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  // Demo playlists
  const playlists = [
    "Chill Vibes",
    "Top Hits",
    "Workout Mix",
    "Focus Flow",
    "Party Time",
  ];

  return (
    <aside
      className={`h-full bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white flex flex-col shadow-card transition-all duration-300 ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar size={40} className="bg-brand text-white font-bold">
            {user?.username ? user.username[0].toUpperCase() : <FaUser />}
          </Avatar>
          {isOpen && (
            <div>
              <div className="font-semibold text-lg leading-tight">
                {user?.username || "User"}
              </div>
              <div className="text-xs text-muted">
                {user?.email || "user@email.com"}
              </div>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <FaXmark /> : <FaBars />}
        </Button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 py-6 px-2 space-y-2">
        {navLinks.map((link) => (
          <Button
            key={link.label}
            variant="ghost"
            size="lg"
            className={`w-full justify-start px-4 py-2 text-base font-medium rounded-xl transition-colors ${
              isOpen ? "" : "px-2 justify-center"
            }`}
            onClick={() => navigate(link.path)}
          >
            <span className="mr-3 text-lg">{link.icon}</span>
            {isOpen && link.label}
          </Button>
        ))}
      </nav>

      {/* Playlists */}
      <div className="px-4 pb-6">
        {isOpen && (
          <div className="text-xs text-muted mb-2 uppercase tracking-wider">
            Playlists
          </div>
        )}
        <div className="space-y-2">
          {playlists.map((playlist) => (
            <Button
              key={playlist}
              variant="secondary"
              size={isOpen ? "md" : "icon"}
              className={`w-full justify-start ${
                isOpen ? "px-4" : "px-2 justify-center"
              }`}
              onClick={() => navigate("/playlist")}
            >
              <FaMusic className="mr-3" />
              {isOpen && playlist}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
