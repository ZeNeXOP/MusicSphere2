import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import Home from "../pages/home";
import Search from "../pages/Search";
import RecommendationPage from "../pages/recom";
import DM from "../pages/dm";
import VirtualRoom from "../pages/virtualroom";
import Profile from "../pages/profile";
import Album from "../pages/album";
import SongDash from "../pages/song";
import Playlist from "../pages/playlist";
import DashBoard from "../pages/dashboard";
import Statistics from "../pages/statistics";
import Achievements from "../pages/achievements";
import Settings from "../pages/settings";
import Login from "../pages/login";
import Register from "../pages/register";
import Upload from "../pages/Upload";
import Library from "../pages/Library";
import History from "../pages/History";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/library" element={<Library />} />
        <Route path="/history" element={<History />} />
        <Route path="/recommendationsystem" element={<RecommendationPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/DirectMessages" element={<DM />} />
        <Route path="/VirtualRoom" element={<VirtualRoom />} />
        <Route path="/search/profile" element={<Profile />} />
        <Route path="/search/album" element={<Album />} />
        <Route path="/search/song" element={<SongDash />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/achievements" element={<Achievements />} />
        <Route path="/dashboard/statistics" element={<Statistics />} />

        {/* Catch all route - redirect to home if logged in, login if not */}
        <Route
          path="*"
          element={user ? <Navigate to="/" /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
