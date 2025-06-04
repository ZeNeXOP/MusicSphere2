import { usePlayer } from "@contexts/PlayerContext";
import { Pause, Play } from "lucide-react";
import { useState } from "react";

interface SongProps {
  title: string;
  artist: string;
  url: string;
  _id: string;
}

const SongCard = ({ title, artist, url, _id }: SongProps) => {
  const { currentSong, isPlaying, playSong, pauseSong } = usePlayer();
  const [isLoading, setIsLoading] = useState(false);
  const isCurrentSong = currentSong?._id === _id;

  const handlePlay = async () => {
    try {
      if (currentSong?._id === _id && isPlaying) {
        pauseSong();
      } else {
        setIsLoading(true);
        await playSong({ _id, title, artist, url });
      }
    } catch (err) {
      // Optionally, you can set an error state here if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900 shadow-lg w-full">
      <button
        onClick={handlePlay}
        className={`p-2 rounded-full ${
          isCurrentSong && isPlaying
            ? "bg-green-500"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        {isCurrentSong && isPlaying ? (
          <Pause size={20} className="text-white" />
        ) : (
          <Play size={20} className="text-white" />
        )}
      </button>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
