import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaMagnifyingGlass, FaUser } from "react-icons/fa6";
import { useAuth } from "@contexts/AuthContext";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-spotify-apple shadow-card">
      <nav className="flex items-center justify-between h-16 px-6">
        {/* Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl font-display font-bold text-white tracking-tight drop-shadow-lg select-none">
            <span className="text-brand">Music</span>
            <span className="text-apple-red">Sphere</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative flex">
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for songs, artists, albums..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900/80 text-white rounded-l-full border border-border focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand placeholder-muted transition"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-brand hover:bg-brand/90 text-white rounded-r-full border border-brand border-l-0 transition-colors"
            >
              <FaMagnifyingGlass className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <FaBell className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            {user?.username ? (
              <Avatar size={32} className="border border-brand">
                {user.username[0].toUpperCase()}
              </Avatar>
            ) : (
              <FaUser className="w-5 h-5" />
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
