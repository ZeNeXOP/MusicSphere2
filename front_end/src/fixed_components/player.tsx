import { usePlayer } from "@contexts/PlayerContext";
import { VolumeX, Volume2, Play, Pause } from "lucide-react";

const Player = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    volume,
    isMuted,
    togglePlay,
    setVolume,
    toggleMute,
    seekTo,
  } = usePlayer();

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    seekTo(newProgress);
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-gray-800 border-t border-gray-700">
      <div className="flex items-center justify-between p-4 h-full">
        <div className="w-full bg-gray-700 h-1 relative -mt-4">
          <div className="bg-green-500 h-1" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-white font-medium">{currentSong.title}</h3>
              <p className="text-sm text-gray-400">{currentSong.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause size={20} className="text-gray-900" />
              ) : (
                <Play size={20} className="text-gray-900 pl-0.5" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
