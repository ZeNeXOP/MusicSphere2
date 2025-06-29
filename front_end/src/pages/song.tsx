import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppShell from "@components/layout/AppShell";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { usePlayer } from "@contexts/PlayerContext";
import {
  FaPlay,
  FaPause,
  FaArrowLeft,
  FaMusic,
  FaCalendar,
  FaUser,
  FaCompactDisc,
  FaTags,
  FaFileLines,
} from "react-icons/fa6";
import axios from "axios";

interface SongData {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  description?: string;
  cover_url?: string;
  cloudinary_url: string;
  duration: number;
  created_at: string;
  uploaded_by: string;
  play_count: number;
  likes: number;
}

const SongPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, pauseSong } = usePlayer();
  const [song, setSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const isCurrentSong = currentSong?._id === id;

  useEffect(() => {
    const fetchSong = async () => {
      if (!id) {
        setError("No song ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/audio/music/${id}`
        );
        setSong(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load song");
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handlePlay = async () => {
    if (!song) return;

    try {
      if (isCurrentSong && isPlaying) {
        pauseSong();
      } else {
        await playSong({
          _id: song._id,
          title: song.title,
          artist: song.artist,
          url: song.cloudinary_url,
        });
      }
    } catch (err) {
      console.error("Error playing song:", err);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto w-full p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !song) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto w-full p-6">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-muted mb-6">{error || "Song not found"}</p>
            <Button onClick={() => navigate(-1)} icon={<FaArrowLeft />}>
              Go Back
            </Button>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto w-full space-y-6 p-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-muted hover:text-primary"
          >
            <FaArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Song Details</h1>
        </div>

        {/* Main Song Info Card */}
        <Card className="p-8 bg-surface">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <div className="w-64 h-64 relative">
                {song.cover_url && !imageError ? (
                  <img
                    src={song.cover_url}
                    alt={`${song.title} cover`}
                    onError={handleImageError}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center shadow-lg">
                    <FaMusic className="text-gray-400" size={64} />
                  </div>
                )}
              </div>
            </div>

            {/* Song Information */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">
                  {song.title}
                </h1>
                <p className="text-2xl text-muted mb-4">{song.artist}</p>
              </div>

              {/* Song Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {song.album && (
                  <div className="flex items-center gap-2">
                    <FaCompactDisc className="text-brand" />
                    <span className="text-muted">Album:</span>
                    <span className="text-primary">{song.album}</span>
                  </div>
                )}

                {song.genre && (
                  <div className="flex items-center gap-2">
                    <FaTags className="text-brand" />
                    <span className="text-muted">Genre:</span>
                    <span className="text-primary">{song.genre}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <FaCalendar className="text-brand" />
                  <span className="text-muted">Uploaded:</span>
                  <span className="text-primary">
                    {formatDate(song.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FaUser className="text-brand" />
                  <span className="text-muted">Uploader:</span>
                  <span className="text-primary">{song.uploaded_by}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaMusic className="text-brand" />
                  <span className="text-muted">Duration:</span>
                  <span className="text-primary">
                    {formatDuration(song.duration)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {song.description && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FaFileLines className="text-brand" />
                    <span className="text-muted font-medium">Description:</span>
                  </div>
                  <p className="text-primary leading-relaxed bg-background p-4 rounded-lg">
                    {song.description}
                  </p>
                </div>
              )}

              {/* Play Button */}
              <div className="mt-8">
                <Button
                  onClick={handlePlay}
                  className="text-lg px-8 py-3"
                  icon={isCurrentSong && isPlaying ? <FaPause /> : <FaPlay />}
                >
                  {isCurrentSong && isPlaying ? "Pause" : "Play Song"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Metrics Section */}
        <Card className="p-6 bg-surface">
          <h2 className="text-xl font-bold text-primary mb-4">Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-brand">
                {song.play_count}
              </div>
              <div className="text-sm text-muted">Plays</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-brand">{song.likes}</div>
              <div className="text-sm text-muted">Likes</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-brand">
                {formatDuration(song.duration)}
              </div>
              <div className="text-sm text-muted">Duration</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-brand">
                {formatDate(song.created_at)}
              </div>
              <div className="text-sm text-muted">Added</div>
            </div>
          </div>

          {/* Placeholder for future metrics */}
          <div className="mt-6 p-4 border-2 border-dashed border-border rounded-lg text-center">
            <p className="text-muted">More metrics coming soon...</p>
            <p className="text-sm text-muted mt-1">
              Analytics, listening history, popularity trends, etc.
            </p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export default SongPage;
