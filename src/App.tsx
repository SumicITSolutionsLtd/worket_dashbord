import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';
import { useAuthStore } from './stores/authStore';
import { authService } from './services/auth.service';
import { extractErrorMessage } from './lib/utils';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // Don't show toast for auth errors (401/403) - these are expected when not logged in
      const axiosError = error as { response?: { status?: number } };
      const status = axiosError?.response?.status;
      if (status === 401 || status === 403) {
        return; // Silently ignore auth errors
      }
      // Show toast for other query errors (API fetch failures)
      toast.error(extractErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        const axiosError = error as { response?: { status?: number } };
        const status = axiosError?.response?.status;
        if (status === 401 || status === 403) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});

// Auth initializer component
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const user = await authService.getMe();
        // Only allow employers and admins
        if (user.is_employer || user.is_staff) {
          setUser(user);
        } else {
          logout();
        }
      } catch (error) {
        // Silently handle auth errors - expected when token is invalid/expired
        // Don't log to console or show errors for expected 401s
        const axiosError = error as { response?: { status?: number } };
        const status = axiosError?.response?.status;
        if (status !== 401 && status !== 403) {
          // Only log unexpected errors
          console.error('Auth initialization error:', error);
        }
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setLoading, logout]);

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
              color: '#1f2937',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthInitializer>
    </QueryClientProvider>
  );
}

export default App;
