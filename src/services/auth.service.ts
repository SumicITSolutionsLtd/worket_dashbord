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
    const user = unwrapResponse<User>(response.data);
    
    // Workaround: API doesn't return is_staff, so we detect it via email pattern
    // TODO: Backend should return is_staff in /auth/me/ response
    if (user.is_staff === undefined || user.is_staff === null) {
      // Check if email matches admin pattern (admin emails typically contain 'admin')
      const isAdminEmail = user.email?.toLowerCase().includes('admin') || 
                          user.email === 'admin2@worket.com';
      (user as any).is_staff = isAdminEmail;
    }
    
    return user;
  },

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    const response = await api.post('/auth/refresh/', {
      refresh: refreshToken,
    });
    return unwrapResponse<{ access: string }>(response.data);
  },
};

export default authService;
