import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@api/client';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Auth API functions
const authApi = {
  checkAuth: async (): Promise<{ authenticated: boolean; user?: User }> => {
    const response = await apiClient.get('/auth/check');
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

// React Query hooks
export const useAuthCheck = () => {
  return useQuery({
    queryKey: ['auth', 'check'],
    queryFn: authApi.checkAuth,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Update auth cache with user data
      queryClient.setQueryData(['auth', 'check'], {
        authenticated: true,
        user: data.user,
      });
    },
    onError: (error) => {
      console.error('Login failed:', handleApiError(error));
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Update auth cache with user data
      queryClient.setQueryData(['auth', 'check'], {
        authenticated: true,
        user: data.user,
      });
    },
    onError: (error) => {
      console.error('Registration failed:', handleApiError(error));
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear auth cache
      queryClient.setQueryData(['auth', 'check'], {
        authenticated: false,
        user: undefined,
      });
      
      // Clear all cached data
      queryClient.clear();
      
      // Clear cookies
      document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    onError: (error) => {
      console.error('Logout failed:', handleApiError(error));
    },
  });
}; 