import React from "react";
import AppShell from "@components/layout/AppShell";
import { Avatar } from "@components/ui/Avatar";
import { Card } from "@components/ui/Card";
import { useAuth } from "@contexts/AuthContext";
import { FaMusic, FaList, FaUserGroup, FaTrophy } from "react-icons/fa6";

const DashBoard = () => {
  const { user } = useAuth();
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Profile Card */}
        <Card className="flex items-center gap-6 p-6 bg-surface">
          <Avatar size={64} className="bg-brand text-white text-3xl font-bold">
            {user?.username ? user.username[0].toUpperCase() : "U"}
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">
              {user?.username || "User"}
            </h1>
            <p className="text-muted text-lg">
              {user?.email || "user@email.com"}
            </p>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="flex flex-col items-center p-4 bg-background">
            <FaMusic className="text-brand text-2xl mb-2" />
            <span className="text-2xl font-bold text-primary">42</span>
            <span className="text-muted text-sm">Songs Uploaded</span>
          </Card>
          <Card className="flex flex-col items-center p-4 bg-background">
            <FaList className="text-accent text-2xl mb-2" />
            <span className="text-2xl font-bold text-primary">7</span>
            <span className="text-muted text-sm">Playlists</span>
          </Card>
          <Card className="flex flex-col items-center p-4 bg-background">
            <FaUserGroup className="text-primary text-2xl mb-2" />
            <span className="text-2xl font-bold text-primary">128</span>
            <span className="text-muted text-sm">Followers</span>
          </Card>
          <Card className="flex flex-col items-center p-4 bg-background">
            <FaTrophy className="text-yellow-400 text-2xl mb-2" />
            <span className="text-2xl font-bold text-primary">3</span>
            <span className="text-muted text-sm">Achievements</span>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 bg-surface">
          <h2 className="text-xl font-bold text-primary mb-4">
            Recent Activity
          </h2>
          <ul className="space-y-2">
            <li className="text-muted">
              🎵 Uploaded <span className="text-primary">"New Beginnings"</span>{" "}
              to <span className="text-primary">Chill Vibes</span>
            </li>
            <li className="text-muted">
              ➕ Added <span className="text-primary">"Levitating"</span> to{" "}
              <span className="text-primary">Top Hits</span>
            </li>
            <li className="text-muted">
              🏆 Unlocked <span className="text-primary">"First Playlist"</span>{" "}
              achievement
            </li>
          </ul>
        </Card>
      </div>
    </AppShell>
  );
};

export default DashBoard;
