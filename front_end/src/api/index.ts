export * from '../api';
import apiDefault from '../api';
export default apiDefault;

// API Client
export { apiClient, handleApiError } from './client';

// Auth hooks
export {
  useAuthCheck,
  useLogin,
  useRegister,
  useLogout,
  type User,
  type AuthResponse,
  type LoginData,
  type RegisterData,
} from '@hooks/useAuth';

// Music hooks
export {
  useUploadSong,
  useAllSongs,
  useSong,
  useSearchSongs,
  useDeleteSong,
  type Song,
  type UploadResponse,
} from '@hooks/useMusic'; 