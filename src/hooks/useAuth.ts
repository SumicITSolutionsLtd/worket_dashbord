import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/auth.service';
import { extractErrorMessage } from '../lib/utils';
import type { LoginRequest } from '../types/api.types';

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, login, logout, setLoading, setUser } = useAuthStore();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.getMe();

        // Check if user is an employer
        if (!userData.is_employer && !userData.is_staff) {
          toast.error('This dashboard is for employers only');
          logout();
          navigate('/login');
          return;
        }

        setUser(userData);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setLoading, setUser, logout, navigate]);

  const handleLogin = useCallback(
    async (data: LoginRequest) => {
      try {
        const response = await authService.login(data);

        // Check if user is an employer
        if (!response.user.is_employer && !response.user.is_staff) {
          toast.error('This dashboard is for employers only');
          return;
        }

        login(response.user, response.tokens);
        toast.success('Welcome back!');

        // Redirect to dashboard for both admins and employers
        navigate('/');
      } catch (error) {
        toast.error(extractErrorMessage(error));
        throw error;
      }
    },
    [login, navigate]
  );

  const handleLogout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Ignore logout errors
    } finally {
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  }, [logout, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isEmployer: user?.is_employer ?? false,
    isAdmin: user?.is_staff ?? false,
    login: handleLogin,
    logout: handleLogout,
  };
}

export default useAuth;
