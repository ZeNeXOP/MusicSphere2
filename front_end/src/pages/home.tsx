import React from "react";
import { useAuth } from "@contexts/AuthContext";
import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";
import AppShell from "@components/layout/AppShell";
import { FaPlay, FaPlus, FaFire } from "react-icons/fa6";

const featuredPlaylists = [
  {
    name: "Chill Vibes",
    description: "Relax and unwind with these mellow tracks.",
    color: "bg-gradient-to-br from-brand to-accent",
  },
  {
    name: "Top Hits",
    description: "The hottest tracks right now.",
    color: "bg-gradient-to-br from-accent to-brand",
  },
  {
    name: "Workout Mix",
    description: "Get pumped with high-energy beats.",
    color: "bg-gradient-to-br from-gray-800 to-gray-900",
  },
];

const trendingSongs = [
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Levitating", artist: "Dua Lipa" },
  { title: "Save Your Tears", artist: "The Weeknd" },
  { title: "Peaches", artist: "Justin Bieber" },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto w-full">
        {/* Hero Section */}
        <section className="rounded-2xl bg-background border border-border p-10 mb-10 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 drop-shadow-lg">
              Welcome back,{" "}
              <span className="text-brand">
                {user?.username || "Music Lover"}
              </span>
              !
            </h1>
            <p className="text-lg text-muted mb-6 max-w-xl">
              Discover new music, upload your own tracks, and build your
              ultimate playlists. Dive into a world of sound!
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                variant="primary"
                icon={<FaPlay />}
                onClick={() => {}}
              >
                Play Trending
              </Button>
              <Button
                size="lg"
                variant="secondary"
                icon={<FaPlus />}
                onClick={() => {}}
              >
                Upload Song
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/public/hero-music.svg"
              alt="Music Hero"
              className="w-64 h-64 object-contain drop-shadow-2xl"
              draggable={false}
            />
          </div>
        </section>

        {/* Featured Playlists */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
            <FaFire className="text-accent" /> Featured Playlists
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPlaylists.map((playlist) => (
              <Card
                key={playlist.name}
                className={`p-6 ${playlist.color} text-primary shadow-card hover:scale-105 transition-transform duration-200`}
              >
                <h3 className="text-xl font-bold mb-2 text-primary drop-shadow">
                  {playlist.name}
                </h3>
                <p className="mb-4 text-primary/90">{playlist.description}</p>
                <Button variant="ghost" size="sm" icon={<FaPlay />}>
                  Play
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Trending Songs */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
            <FaFire className="text-accent" /> Trending Songs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingSongs.map((song) => (
              <Card
                key={song.title}
                className="p-4 flex flex-col items-start bg-surface hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1 text-primary">
                    {song.title}
                  </h4>
                  <p className="text-muted text-sm mb-2">{song.artist}</p>
                </div>
                <Button variant="primary" size="sm" icon={<FaPlay />}>
                  Play
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default Home;
