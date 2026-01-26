import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CircleNotch } from '@phosphor-icons/react';
import { useAuthStore } from '../stores/authStore';

// Layouts
import EmployerLayout from '../components/layout/EmployerLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import JobsPage from '../pages/JobsPage';
import CreateJobPage from '../pages/CreateJobPage';
import EditJobPage from '../pages/EditJobPage';
import JobApplicationsPage from '../pages/JobApplicationsPage';
import AIShortlistPage from '../pages/AIShortlistPage';
import EmployerApplicationsPage from '../pages/admin/EmployerApplicationsPage';
import ReviewApplicationPage from '../pages/admin/ReviewApplicationPage';
import AllUsersPage from '../pages/admin/AllUsersPage';
import AllCompaniesPage from '../pages/admin/AllCompaniesPage';
import AllCoursesPage from '../pages/admin/AllCoursesPage';

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <CircleNotch weight="bold" className="w-8 h-8 text-primary-500 animate-spin" />
  </div>
);

// Protected Route wrapper
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requireAdmin?: boolean;
}> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is employer or admin
  if (!user?.is_employer && !user?.is_staff) {
    return <Navigate to="/login" replace />;
  }

  // Check admin requirement
  if (requireAdmin && !user?.is_staff) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Public Only Route (redirect to dashboard if authenticated)
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    // Redirect based on user type
    if (user?.is_staff) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Routes - Accessible by both employers and admins */}
        <Route
          element={
            <ProtectedRoute>
              <EmployerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/create" element={<CreateJobPage />} />
          <Route path="jobs/:id/edit" element={<EditJobPage />} />
          <Route path="jobs/:id/applications" element={<JobApplicationsPage />} />
          <Route path="jobs/:id/ai-shortlist" element={<AIShortlistPage />} />
          
          {/* Admin-only routes */}
          <Route path="admin/applications" element={<EmployerApplicationsPage />} />
          <Route path="admin/applications/:id" element={<ReviewApplicationPage />} />
          <Route path="admin/users" element={<AllUsersPage />} />
          <Route path="admin/companies" element={<AllCompaniesPage />} />
          <Route path="admin/courses" element={<AllCoursesPage />} />
        </Route>

        {/* Catch all - redirect to dashboard or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
