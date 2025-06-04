import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
console.log("API_URL:", API_URL);


// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Auth services
export const authService = {
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Registration failed');
      }
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Login failed');
      }
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Logout failed');
      }
      throw error;
    }
  },
  
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/check');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Auth check failed');
      }
      return { authenticated: false };
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Token refresh failed');
      }
      throw error;
    }
  }
};

// Add more service modules as needed:

// User service
export const userService = {
  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.put('/api/user/profile', profileData);
    return response.data;
  }
};

// Music service
export const musicService = {
  getRecommendations: async () => {
    const response = await api.get('/api/music/recommendations');
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get(`/audio/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
  uploadMusic: async (formData: FormData) => {
    const response = await api.post('/audio/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAudios: async () => {
    const response = await api.get('/audio/audios');
    return response.data;
  }
};

api.interceptors.response.use(
  response => response, error=> {
    if (error.response?.status === 401){
      document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
)

export default api;