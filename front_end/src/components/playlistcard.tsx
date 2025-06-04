import { div } from "framer-motion/m";
import React from "react";
import { FaMusic } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ name, isOpen }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/playlist")}
      className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-800 cursor-pointer transition-all"
    >
      <FaMusic size={24} className="text-gray-400" />
      {isOpen && <span className="text-gray-300">{name}</span>}
    </div>
  );
};

export default PlaylistCard;
