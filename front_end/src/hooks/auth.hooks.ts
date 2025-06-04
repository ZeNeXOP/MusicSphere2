import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginRequest, RegisterRequest, User } from '@api/auth.service';

export const AUTH_KEYS = {
  check: ['auth', 'check'] as const,
  user: ['auth', 'user'] as const,
};

// Auth check query
export const useAuthCheck = () => {
  return useQuery({
    queryKey: AUTH_KEYS.check,
    queryFn: authService.checkAuth,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      // Update auth cache
      queryClient.setQueryData(AUTH_KEYS.check, {
        authenticated: true,
        user: data.user,
      });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user });
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      // Update auth cache
      queryClient.setQueryData(AUTH_KEYS.check, {
        authenticated: true,
        user: data.user,
      });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user });
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.setQueryData(AUTH_KEYS.check, {
        authenticated: false,
        user: undefined,
      });
      queryClient.removeQueries({ queryKey: AUTH_KEYS.user });
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.refreshToken,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.check, {
        authenticated: true,
        user: data.user,
      });
    },
  });
}; 