import { div } from "framer-motion/m";
import React from "react";
import { FaUser } from "react-icons/fa6";

const ListeningCard = ({ username, song, artist, isOpen }) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
      <div className="w-10 h-10 bg-gray-500 flex items-center justify-center rounded-full">
        <FaUser className="text-white text-xl" />
      </div>
      {isOpen && (
        <div className="text-white">
          <h3 className="text-sm font-semibold">{username}</h3>
          <p className="text-xs text-gray-400">
            {song} • {artist}
          </p>
        </div>
      )}
    </div>
  );
};

export default ListeningCard;
