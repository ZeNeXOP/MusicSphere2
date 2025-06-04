import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaHouse,
  FaUser,
  FaMusic,
  FaChartSimple,
  FaBars,
  FaXmark,
  FaMagnifyingGlass,
  FaBookBookmark,
} from "react-icons/fa6";
import { div, li } from "framer-motion/m";
import PlaylistCard from "../components/playlistcard";
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const playlists = ["Playlist 1", "Playlist 2", "Playlist 3", "Playlist 4"];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div
      animate={{ width: isOpen ? "300px" : "80px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full bg-black text-grey-300 overflow-hidden pt-16"
    >
      <div className="flex items-center p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white transition-colors p-2 "
        ></button>
      </div>
      <div className="mt-16 px-4">
        <nav>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            {isOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
          </button>
        </nav>
      </div>
      <div className="mt-4 px-4">
        {playlists.map((playlist, index) => (
          <PlaylistCard key={index} name={playlist} isOpen={isOpen} />
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;
