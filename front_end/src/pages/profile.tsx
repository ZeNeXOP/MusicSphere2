import React from "react";
import AppShell from "@components/layout/AppShell";
import { Avatar } from "@components/ui/Avatar";
import { Card } from "@components/ui/Card";
import { useAuth } from "@contexts/AuthContext";
import { FaMusic, FaList } from "react-icons/fa6";

const demoPlaylists = [
  { name: "Chill Vibes", songs: 12 },
  { name: "Top Hits", songs: 8 },
  { name: "Workout Mix", songs: 15 },
];

const Profile = () => {
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

        {/* Playlists */}
        <Card className="p-6 bg-background">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <FaList className="text-accent" /> Playlists
          </h2>
          <ul className="space-y-2">
            {demoPlaylists.map((pl) => (
              <li
                key={pl.name}
                className="flex items-center gap-3 text-primary"
              >
                <FaMusic className="text-brand" />
                <span className="font-semibold">{pl.name}</span>
                <span className="text-muted text-sm">({pl.songs} songs)</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
};

export default Profile;
