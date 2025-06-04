import React, { useState } from "react";
import { usePlayHistory, useRecentPlays, useMostPlayed } from "@hooks/useMusic";
import AppShell from "@components/layout/AppShell";
import { Card } from "@components/ui/Card";
import { formatDistanceToNow } from "date-fns";
import {
  FaPlay,
  FaClock,
  FaClockRotateLeft,
  FaChartBar,
} from "react-icons/fa6";
import { usePlayer } from "@contexts/PlayerContext";
import { Song } from "@hooks/useMusic";

type TabType = "recent" | "history" | "most-played";

const History = () => {
  const [activeTab, setActiveTab] = useState<TabType>("recent");
  const { data: history } = usePlayHistory(50);
  const { data: recentPlays } = useRecentPlays(10);
  const { data: mostPlayed } = useMostPlayed(10);
  const { playSong, currentSong, isPlaying } = usePlayer();

  const handlePlay = (song: Song) => {
    playSong(song);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderRecentPlays = () => (
    <div className="space-y-4">
      {recentPlays?.map((play) => (
        <Card
          key={play.song_id}
          className="p-4 flex items-center justify-between hover:bg-surface/60 transition-colors cursor-pointer"
          onClick={() =>
            handlePlay({
              _id: play.song_id,
              title: play.song_title,
              artist: play.artist,
              url: "", // URL will be fetched when playing
            })
          }
        >
          <div className="flex items-center space-x-4">
            <div
              className={`w-10 h-10 rounded-full bg-brand flex items-center justify-center ${
                currentSong?._id === play.song_id && isPlaying
                  ? "animate-pulse"
                  : ""
              }`}
            >
              <FaPlay className="text-white" />
            </div>
            <div>
              <h3 className="text-primary font-semibold">{play.song_title}</h3>
              <p className="text-muted text-sm">{play.artist}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-muted">
            <span className="text-sm">
              {formatDistanceToNow(new Date(play.last_played), {
                addSuffix: true,
              })}
            </span>
            <span className="text-sm">Played {play.play_count} times</span>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      {history?.map((entry) => (
        <Card
          key={entry._id}
          className="p-4 flex items-center justify-between hover:bg-surface/60 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
              <FaClock className="text-muted" />
            </div>
            <div>
              <h3 className="text-primary font-semibold">{entry.song_title}</h3>
              <p className="text-muted text-sm">{entry.artist}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-muted">
            <span className="text-sm">
              {formatDistanceToNow(new Date(entry.played_at), {
                addSuffix: true,
              })}
            </span>
            <span className="text-sm">
              {formatDuration(entry.duration_played)}
            </span>
            {entry.completed && (
              <span className="text-xs bg-brand/20 text-brand px-2 py-1 rounded-full">
                Completed
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderMostPlayed = () => (
    <div className="space-y-4">
      {mostPlayed?.map((song, index) => (
        <Card
          key={song.song_id}
          className="p-4 flex items-center justify-between hover:bg-surface/60 transition-colors cursor-pointer"
          onClick={() =>
            handlePlay({
              _id: song.song_id,
              title: song.song_title,
              artist: song.artist,
              url: "", // URL will be fetched when playing
            })
          }
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center">
              <span className="text-white font-bold">#{index + 1}</span>
            </div>
            <div>
              <h3 className="text-primary font-semibold">{song.song_title}</h3>
              <p className="text-muted text-sm">{song.artist}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-muted">
            <span className="text-sm">
              {formatDuration(song.total_duration)} total
            </span>
            <span className="text-sm">Played {song.play_count} times</span>
            <span className="text-sm">
              Last played{" "}
              {formatDistanceToNow(new Date(song.last_played), {
                addSuffix: true,
              })}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-primary">Listening History</h1>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-border">
          <button
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === "recent"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-primary"
            }`}
            onClick={() => setActiveTab("recent")}
          >
            <FaClockRotateLeft />
            <span>Recently Played</span>
          </button>
          <button
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === "history"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-primary"
            }`}
            onClick={() => setActiveTab("history")}
          >
            <FaClock />
            <span>Full History</span>
          </button>
          <button
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === "most-played"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-primary"
            }`}
            onClick={() => setActiveTab("most-played")}
          >
            <FaChartBar />
            <span>Most Played</span>
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "recent" && renderRecentPlays()}
          {activeTab === "history" && renderHistory()}
          {activeTab === "most-played" && renderMostPlayed()}
        </div>
      </div>
    </AppShell>
  );
};

export default History;
