import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaX } from "react-icons/fa6";

const NotificationOverlay = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute top-16 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-50"
      >
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button onClick={onClose} className="text-gray-500">
            <FaX size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            notifications.map((notif, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded-md shadow">
                <p className="text-sm">{notif.message}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationOverlay;
