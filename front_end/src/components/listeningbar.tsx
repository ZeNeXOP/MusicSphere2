import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaXmark, FaBars } from "react-icons/fa6";
import ListeningCard from "@components/listenercard";
import { useNavigate } from "react-router-dom";

const ListeningBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const listeners = [
    { username: "Alex", song: "Favourite T-shirt", artist: "Jake Scott" },
    { username: "Sarah", song: "Sweater Weather", artist: "The Neighbourhood" },
  ];

  return (
    <motion.div
      animate={{ width: isOpen ? "300px" : "80px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full bg-black text-grey-300 overflow-hidden pt-16"
    >
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white transition-colors p-2"
        ></button>
      </div>
      <div className="mt-16 px-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          {isOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
        </button>
        <div className={isOpen ? "block" : "flex justify-center"}>
          <h2 className="text-white hover:text-gray transition-colors p-4">
            Listening Now
          </h2>
        </div>
      </div>
      <div className="space-y-2">
        {listeners.map((listener, index) => (
          <div key={index} className={isOpen ? "block" : "flex justify-center"}>
            <ListeningCard {...listener} isOpen={isOpen} />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full flex justify-center p-4">
        <button
          className="text-gray-400 hover:text-white transition-colors p-2"
          onClick={() => navigate("/VirtualRoom")}
        >
          {isOpen ? "Virtual Room" : "VR"}
        </button>
      </div>
    </motion.div>
  );
};

export default ListeningBar;
