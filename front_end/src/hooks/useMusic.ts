import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@api/client';

// Types
export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  description?: string;
  duration?: number;
  url: string;
  cover_url?: string;
  uploaded_by?: string;
  created_at?: string;
  file_size?: number;
  format?: string;
  play_count?: number;
  likes?: number;
  public?: boolean;
}

export interface UploadResponse {
  message: string;
  song: Song;
}

export interface PlayHistory {
  _id: string;
  song_title: string;
  artist: string;
  duration_played: number;
  played_at: string;
  completed: boolean;
}

export interface RecentPlay {
  song_id: string;
  song_title: string;
  artist: string;
  last_played: string;
  play_count: number;
}

export interface MostPlayed {
  song_id: string;
  song_title: string;
  artist: string;
  play_count: number;
  last_played: string;
  total_duration: number;
}

// Music API functions
const musicApi = {
  uploadSong: async (formData: FormData): Promise<UploadResponse> => {
    const response = await apiClient.post('/audio/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAllSongs: async (): Promise<Song[]> => {
    const response = await apiClient.get('/audio/music');
    // Map backend data structure to frontend expectations
    return response.data.map((song: any) => ({
      ...song,
      id: song._id, // Map _id to id
      uploaded_by: song.uploaded_by || 'Unknown',
      created_at: song.created_at || new Date().toISOString(),
    }));
  },

  getSongById: async (id: string): Promise<Song> => {
    const response = await apiClient.get(`/audio/music/${id}`);
    return response.data;
  },

  searchSongs: async (query: string): Promise<Song[]> => {
    const response = await apiClient.get(`/audio/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  deleteSong: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/audio/music/${id}`);
    return response.data;
  },

  recordPlay: async (song_id: string, duration_played: number): Promise<{ message: string; history_id: string }> => {
    const response = await apiClient.post('/audio/history/record', {
      song_id,
      duration_played,
    });
    return response.data;
  },

  getPlayHistory: async (limit?: number): Promise<PlayHistory[]> => {
    const response = await apiClient.get('/audio/history', {
      params: { limit },
    });
    return response.data;
  },

  getRecentPlays: async (limit?: number): Promise<RecentPlay[]> => {
    const response = await apiClient.get('/audio/history/recent', {
      params: { limit },
    });
    return response.data;
  },

  getMostPlayed: async (limit?: number): Promise<MostPlayed[]> => {
    const response = await apiClient.get('/audio/history/most-played', {
      params: { limit },
    });
    return response.data;
  },
};

// React Query hooks
export const useUploadSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: musicApi.uploadSong,
    onSuccess: () => {
      // Invalidate and refetch songs list
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
    onError: (error) => {
      console.error('Upload failed:', handleApiError(error));
    },
  });
};

export const useAllSongs = () => {
  return useQuery({
    queryKey: ['songs'],
    queryFn: musicApi.getAllSongs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSong = (id: string) => {
  return useQuery({
    queryKey: ['songs', id],
    queryFn: () => musicApi.getSongById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useSearchSongs = (query: string) => {
  return useQuery({
    queryKey: ['songs', 'search', query],
    queryFn: () => musicApi.searchSongs(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: musicApi.deleteSong,
    onSuccess: () => {
      // Invalidate and refetch songs list
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
    onError: (error) => {
      console.error('Delete failed:', handleApiError(error));
    },
  });
};

export const useRecordPlay = () => {
  return useMutation({
    mutationFn: ({ song_id, duration_played }: { song_id: string; duration_played: number }) =>
      musicApi.recordPlay(song_id, duration_played),
    onError: (error) => {
      console.error('Failed to record play:', handleApiError(error));
    },
  });
};

export const usePlayHistory = (limit?: number) => {
  return useQuery({
    queryKey: ['playHistory', limit],
    queryFn: () => musicApi.getPlayHistory(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRecentPlays = (limit?: number) => {
  return useQuery({
    queryKey: ['recentPlays', limit],
    queryFn: () => musicApi.getRecentPlays(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMostPlayed = (limit?: number) => {
  return useQuery({
    queryKey: ['mostPlayed', limit],
    queryFn: () => musicApi.getMostPlayed(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 