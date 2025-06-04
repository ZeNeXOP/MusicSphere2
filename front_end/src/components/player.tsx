import { usePlayer } from "@contexts/PlayerContext";
import {
  VolumeX,
  Volume2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
} from "lucide-react";

const Player = () => {
  const {
    currentSong,
    isPlaying,
    isLoading,
    progress,
    duration,
    currentTime,
    volume,
    isMuted,
    error,
    togglePlay,
    setVolume,
    toggleMute,
    seekTo,
    skipForward,
    skipBackward,
  } = usePlayer();

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    seekTo(Math.max(0, Math.min(100, newProgress)));
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700">
      {/* Progress Bar */}
      <div
        className="w-full bg-gray-700 h-1 cursor-pointer hover:h-2 transition-all group"
        onClick={handleProgressClick}
      >
        <div
          className="bg-green-500 h-full transition-all relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
        </div>
      </div>

      {/* Main Player Content */}
      <div className="flex items-center justify-between p-4 h-20">
        {/* Song Info */}
        <div className="flex items-center gap-4 min-w-0 w-80">
          <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {currentSong.cover_url ? (
              <img
                src={currentSong.cover_url}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-500 text-2xl">♪</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-medium truncate">
              {currentSong.title}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {currentSong.artist}
            </p>
            {error && <p className="text-xs text-red-400 truncate">{error}</p>}
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-4">
            <button
              onClick={skipBackward}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause size={20} className="text-gray-900" />
              ) : (
                <Play size={20} className="text-gray-900 ml-0.5" />
              )}
            </button>

            <button
              onClick={skipForward}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-3 w-80 justify-end">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #22c55e 0%, #22c55e ${
                  (isMuted ? 0 : volume) * 100
                }%, #374151 ${(isMuted ? 0 : volume) * 100}%, #374151 100%)`,
              }}
            />
            <span className="text-xs text-gray-400 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}
            </span>
          </div>
        </div>
      </div>

      {/* Custom styles for range input */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Player;
