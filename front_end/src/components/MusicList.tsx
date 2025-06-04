import { useEffect, useState } from "react";
import axios from "axios";
import SongCard from "./songcard";
import ErrorBoundary from "./ErrorBoundary";

interface Song {
  _id: string;
  title: string;
  artist: string;
  url: string;
  album?: string;
  genre?: string;
  duration?: number;
}

interface MusicListProps {
  songs?: Song[];
  title?: string;
}

const isValidSong = (song: any): song is Song => {
  return (
    typeof song === "object" &&
    typeof song.title === "string" &&
    typeof song.url === "string"
  );
};

const MusicList = ({
  songs: propSongs,
  title = "Music Library",
}: MusicListProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If songs are provided as props, use them
    if (propSongs) {
      setSongs(propSongs);
      return;
    }

    // Otherwise, fetch all music
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/audio/music")
      .then((response) => {
        const validSongs = response.data.filter(
          (song: any) => song.url && typeof song.url === "string"
        );
        setSongs(validSongs);
      })
      .catch((error) => {
        console.error("Error fetching music:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [propSongs]);

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="flex flex-col gap-4">
        {songs.length === 0 ? (
          <p className="text-gray-400">No songs available.</p>
        ) : (
          songs.map((song) => (
            <ErrorBoundary key={song._id}>
              <SongCard
                _id={song._id}
                title={song.title}
                artist={song.artist}
                url={song.url}
              />
            </ErrorBoundary>
          ))
        )}
      </div>
    </div>
  );
};

export default MusicList;
