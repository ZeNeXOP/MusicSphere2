import { usePlayer } from "@contexts/PlayerContext";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMusic } from "react-icons/fa6";

interface SongProps {
  title: string;
  artist: string;
  url: string;
  _id: string;
  cover_url?: string;
}

const SongCard = ({ title, artist, url, _id, cover_url }: SongProps) => {
  const { currentSong, isPlaying, playSong, pauseSong } = usePlayer();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
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

  const handleImageError = () => {
    setImageError(true);
  };

  const handleTitleClick = () => {
    navigate(`/song/${_id}`);
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900 shadow-lg w-full">
      {/* Cover Image */}
      <div className="relative w-12 h-12 flex-shrink-0">
        {cover_url && !imageError ? (
          <img
            src={cover_url}
            alt={`${title} cover`}
            onError={handleImageError}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 rounded-md flex items-center justify-center">
            <FaMusic className="text-gray-400" size={16} />
          </div>
        )}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handlePlay}
        className={`p-2 rounded-full flex-shrink-0 ${
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

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h3
          className="text-lg font-bold text-white truncate cursor-pointer hover:text-brand transition-colors"
          onClick={handleTitleClick}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
