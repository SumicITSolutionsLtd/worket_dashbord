import api from '../lib/api';
import type { User, AuthTokens, LoginRequest, ApiResponse } from '../types/api.types';

interface LoginData {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginData> {
    const response = await api.post<ApiResponse<LoginData>>('/auth/login/', data);
    // Handle wrapped response { status, data }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data as unknown as LoginData;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout/', { refresh: refreshToken });
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User> | User>('/auth/me/');
    // Handle wrapped response { status, data } or direct user object
    if ('data' in response.data && 'status' in response.data) {
      return (response.data as ApiResponse<User>).data;
    }
    return response.data as User;
  },

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    const response = await api.post<ApiResponse<{ access: string }> | { access: string }>('/auth/refresh/', {
      refresh: refreshToken,
    });
    // Handle wrapped response
    if ('data' in response.data && 'status' in response.data) {
      return (response.data as ApiResponse<{ access: string }>).data;
    }
    return response.data as { access: string };
  },
};

export default authService;
