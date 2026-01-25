import api from '../lib/api';
import type { User, AuthTokens, LoginRequest } from '../types/api.types';

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login/', data);
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout/', { refresh: refreshToken });
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me/');
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    const response = await api.post<{ access: string }>('/auth/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};

export default authService;
