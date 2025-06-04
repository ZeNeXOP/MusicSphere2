import React from "react";
import { FaX } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfileOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute top-16 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-50"
    >
      <div className="flex justify-between items-center border-b pb-2">
        <button onClick={onClose} className="text-gray-500">
          <FaX size={20} />
        </button>
      </div>
      <div className="mt-4 space-y-3">
        <div className="p-2 bg-gray-100 rounded-md shadow">
          <p
            onClick={() => navigate("/dashboard")}
            className="text-sm p-2 bg-gray-100 rounded-md shadow hover:bg-gray-300 cursor-pointer transition-all"
          >
            DashBoard
          </p>
          <p
            onClick={() => navigate("/dashboard/statistics")}
            className="text-sm p-2 bg-gray-100 rounded-md shadow hover:bg-gray-300 cursor-pointer transition-all"
          >
            Statistics
          </p>
          <p
            onClick={() => navigate("/dashboard/achievements")}
            className="text-sm p-2 bg-gray-100 rounded-md shadow hover:bg-gray-300 cursor-pointer transition-all"
          >
            Achievements
          </p>
          <p
            onClick={() => navigate("/dashboard/settings")}
            className="text-sm p-2 bg-gray-100 rounded-md shadow hover:bg-gray-300 cursor-pointer transition-all"
          >
            Settings
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileOverlay;
