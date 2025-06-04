import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useRecordPlay } from "@hooks/useMusic";

interface Song {
  _id: string;
  title: string;
  artist: string;
  url: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  error: string | null;
  playSong: (song: Song) => Promise<void>;
  pauseSong: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (percentage: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const playStartTimeRef = useRef<number | null>(null);
  const recordPlayMutation = useRecordPlay();

  // Record play duration
  const recordPlayDuration = useCallback(() => {
    if (currentSong && playStartTimeRef.current !== null) {
      const playDuration = (Date.now() - playStartTimeRef.current) / 1000; // Convert to seconds
      recordPlayMutation.mutate({
        song_id: currentSong._id,
        duration_played: playDuration,
      });
      playStartTimeRef.current = null;
    }
  }, [currentSong, recordPlayMutation]);

  // Reset progress and time when new song starts
  const resetProgress = useCallback(() => {
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  // Update progress and time
  const updateProgress = useCallback(() => {
    const audio = audioRef.current;
    if (audio.duration && !isNaN(audio.duration)) {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      setCurrentTime(currentTime);
      setDuration(duration);
      setProgress((currentTime / duration) * 100);
    }
  }, []);

  // Handle when song ends
  const handleSongEnd = useCallback(() => {
    setIsPlaying(false);
    setProgress(100);
    recordPlayDuration(); // Record play duration when song ends
    console.log("Song ended");
    // Optionally auto-play next song here
  }, [recordPlayDuration]);

  // Handle loading metadata
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    setDuration(audio.duration || 0);
    setIsLoading(false);
  }, []);

  // Handle errors
  const handleError = useCallback((e: Event) => {
    console.error("Audio error:", e);
    setError("Failed to load audio");
    setIsLoading(false);
    setIsPlaying(false);
    recordPlayDuration(); // Record play duration on error
  }, [recordPlayDuration]);

  // Handle when audio can start playing
  const handleCanPlay = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  // Handle when audio starts playing
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setError(null);
    playStartTimeRef.current = Date.now(); // Record play start time
  }, []);

  // Handle when audio is paused
  const handlePause = useCallback(() => {
    setIsPlaying(false);
    recordPlayDuration(); // Record play duration when paused
  }, [recordPlayDuration]);

  // Handle when audio is waiting/buffering
  const handleWaiting = useCallback(() => {
    setIsLoading(true);
  }, []);

  // Handle when audio can play through
  const handleCanPlayThrough = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Setup event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    // Set initial volume
    audio.volume = volume;
    audio.preload = "metadata";

    // Add all event listeners
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleSongEnd);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      // Clean up event listeners
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleSongEnd);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [
    updateProgress,
    handleSongEnd,
    handleLoadedMetadata,
    handleError,
    handleCanPlay,
    handlePlay,
    handlePause,
    handleWaiting,
    handleCanPlayThrough,
    volume,
  ]);

  const playSong = async (song: Song) => {
    try {
      const audio = audioRef.current;
      setError(null);
      
      // Record previous song's play duration if exists
      if (currentSong && currentSong._id !== song._id) {
        recordPlayDuration();
      }
      
      // If it's a new song, reset everything and load new source
      if (currentSong?._id !== song._id) {
        setIsLoading(true);
        audio.pause();
        resetProgress();
        
        // Set new source with Cloudinary streaming parameters
        audio.src = `${song.url}?resource_type=video&f_auto&fl_streaming_attachment`;
        setCurrentSong(song);
        
        // Wait for the audio to be ready
        await new Promise((resolve, reject) => {
          const handleCanPlay = () => {
            audio.removeEventListener("canplay", handleCanPlay);
            audio.removeEventListener("error", handleError);
            resolve(void 0);
          };
          
          const handleError = () => {
            audio.removeEventListener("canplay", handleCanPlay);
            audio.removeEventListener("error", handleError);
            reject(new Error("Failed to load audio"));
          };
          
          audio.addEventListener("canplay", handleCanPlay);
          audio.addEventListener("error", handleError);
          audio.load();
        });
      }

      // Play the audio
      await audio.play();
      playStartTimeRef.current = Date.now(); // Record play start time
    } catch (err) {
      console.error("Error playing song:", err);
      setError("Failed to play audio");
      setIsLoading(false);
    }
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = async () => {
    try {
      if (isPlaying) {
        pauseSong();
      } else if (currentSong) {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error toggling play:", err);
      setError("Failed to play audio");
      setIsPlaying(false);
    }
  };

  const setVolume = (vol: number) => {
    const clampedVolume = Math.max(0, Math.min(1, vol));
    setVolumeState(clampedVolume);
    audioRef.current.volume = clampedVolume;
    if (clampedVolume > 0 && isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioRef.current.muted = newMutedState;
  };

  const seekTo = (percentage: number) => {
    const audio = audioRef.current;
    if (audio.duration && !isNaN(audio.duration)) {
      const newTime = (percentage / 100) * audio.duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage);
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || 0);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    audio.currentTime = Math.max(audio.currentTime - 10, 0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        isLoading,
        progress,
        duration,
        currentTime,
        volume,
        isMuted,
        error,
        playSong,
        pauseSong,
        togglePlay,
        setVolume,
        toggleMute,
        seekTo,
        skipForward,
        skipBackward,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
};