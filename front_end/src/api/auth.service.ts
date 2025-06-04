import { apiClient } from './client';

export interface User {
  email: string;
  username: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/logout');
    return response.data;
  },

  async checkAuth(): Promise<{ authenticated: boolean; user?: User }> {
    const response = await apiClient.get<{ authenticated: boolean; user?: User }>('/auth/check');
    return response.data;
  },

  async refreshToken(): Promise<{ authenticated: boolean; user: User }> {
    const response = await apiClient.post<{ authenticated: boolean; user: User }>('/auth/refresh');
    return response.data;
  },
}; 