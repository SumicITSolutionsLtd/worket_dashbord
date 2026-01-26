import api, { unwrapResponse } from '../lib/api';
import type { User, AuthTokens, LoginRequest } from '../types/api.types';

interface LoginData {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginData> {
    const response = await api.post('/auth/login/', data);
    return unwrapResponse<LoginData>(response.data);
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout/', { refresh: refreshToken });
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me/');
    return unwrapResponse<User>(response.data);
  },

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    const response = await api.post('/auth/refresh/', {
      refresh: refreshToken,
    });
    return unwrapResponse<{ access: string }>(response.data);
  },
};

export default authService;
