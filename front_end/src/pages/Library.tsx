import React from "react";
import { useAllSongs, useDeleteSong } from "@hooks/useMusic";
import { handleApiError } from "@api/client";
import { FaPlay, FaPause, FaTrash, FaClock, FaMusic } from "react-icons/fa6";
import AppShell from "@components/layout/AppShell";
import { Card } from "@components/ui/Card";
import { usePlayer } from "@contexts/PlayerContext";

const Library = () => {
  const { data: songs, isLoading, error } = useAllSongs();
  const deleteMutation = useDeleteSong();
  const { currentSong, isPlaying, playSong, pauseSong } = usePlayer();

  const handlePlayPause = async (song: any) => {
    try {
      // If this song is currently playing, pause it
      if (currentSong?._id === song.id && isPlaying) {
        pauseSong();
      } else {
        // Otherwise, play this song
        await playSong({
          _id: song.id,
          title: song.title,
          artist: song.artist,
          url: song.url,
        });
      }
    } catch (err) {
      console.error("Failed to play/pause song:", err);
    }
  };

  const handleDelete = async (songId: string, songTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${songTitle}"?`)) {
      try {
        await deleteMutation.mutateAsync(songId);
      } catch (err) {
        console.error("Delete failed:", handleApiError(err));
        alert("Failed to delete song");
      }
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isCurrentlyPlaying = (songId: string) => {
    return currentSong?._id === songId && isPlaying;
  };

  const isCurrentSong = (songId: string) => {
    return currentSong?._id === songId;
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto w-full space-y-8 mb-12">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {handleApiError(error)}
          </div>
        ) : !songs || songs.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-primary mb-4">
              No Songs Found
            </h2>
            <p className="text-muted">Upload some music to get started!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">Your Library</h1>
              <p className="text-muted">{songs.length} songs</p>
            </div>

            <div className="bg-surface rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-muted text-sm font-medium uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-6">Title</div>
                <div className="col-span-3">Artist</div>
                <div className="col-span-1">Album</div>
                <div className="col-span-1 flex justify-center">
                  <FaClock />
                </div>
              </div>

              {/* Songs List */}
              <div className="divide-y divide-border">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-800 transition-colors group items-center ${
                      isCurrentSong(song.id) ? "bg-gray-800/50" : ""
                    }`}
                  >
                    <div className="col-span-1 flex items-center">
                      <span
                        className={`group-hover:hidden ${
                          isCurrentSong(song.id)
                            ? "text-green-500"
                            : "text-white"
                        }`}
                      >
                        {isCurrentSong(song.id) ? "♪" : index + 1}
                      </span>
                      <button
                        className="hidden group-hover:block text-primary hover:text-brand"
                        onClick={() => handlePlayPause(song)}
                      >
                        {isCurrentlyPlaying(song.id) ? (
                          <FaPause size={16} />
                        ) : (
                          <FaPlay size={16} />
                        )}
                      </button>
                    </div>

                    {/* Album Art + Title */}
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden">
                        {/* Album art placeholder */}
                        {song.cover_url ? (
                          <img
                            src={song.cover_url}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaMusic className="text-muted text-2xl" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            isCurrentSong(song.id)
                              ? "text-green-500"
                              : "text-primary"
                          }`}
                        >
                          {song.title}
                        </p>
                        <div className="flex items-center gap-2 text-muted text-xs">
                          <span>
                            Uploaded:{" "}
                            {new Date(
                              song.created_at || new Date()
                            ).toLocaleDateString()}
                          </span>
                          {song.genre && (
                            <>
                              <span>•</span>
                              <span>{song.genre}</span>
                            </>
                          )}
                          {song.format && (
                            <>
                              <span>•</span>
                              <span className="uppercase">{song.format}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center">
                      <p
                        className={`${
                          isCurrentSong(song.id)
                            ? "text-green-500"
                            : "text-primary"
                        }`}
                      >
                        {song.artist}
                      </p>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <p className="text-muted">{song.album || "--"}</p>
                    </div>

                    <div className="col-span-1 flex items-center justify-center space-x-2">
                      <span className="text-muted text-sm">
                        {formatDuration(song.duration)}
                      </span>
                      <button
                        onClick={() => handleDelete(song.id, song.title)}
                        disabled={deleteMutation.isPending}
                        className="opacity-0 group-hover:opacity-100 text-muted hover:text-accent transition-all disabled:opacity-50"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {deleteMutation.isPending && (
              <div className="fixed bottom-4 right-4 bg-surface text-primary px-4 py-2 rounded-lg shadow-lg">
                Deleting song...
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
};

export default Library;
