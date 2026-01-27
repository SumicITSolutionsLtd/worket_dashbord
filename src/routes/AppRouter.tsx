import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CircleNotch } from '@phosphor-icons/react';
import { useAuthStore } from '../stores/authStore';
import { isPlatformAdmin } from '../lib/auth';

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
import EmployerOnboardingPage from '../pages/EmployerOnboardingPage';
import CompanyProfilePage from '../pages/CompanyProfilePage';
import EmployerApplicationsPage from '../pages/admin/EmployerApplicationsPage';
import ReviewApplicationPage from '../pages/admin/ReviewApplicationPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ProfilesManagementPage from '../pages/admin/ProfilesManagementPage';
import JobsManagementPage from '../pages/admin/JobsManagementPage';
import CompaniesManagementPage from '../pages/admin/CompaniesManagementPage';
import SkillsManagementPage from '../pages/admin/SkillsManagementPage';
import AdminJobDetailPage from '../pages/admin/AdminJobDetailPage';
import AdminCompanyDetailPage from '../pages/admin/AdminCompanyDetailPage';
import AdminProfileDetailPage from '../pages/admin/AdminProfileDetailPage';

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

  // Check if user is employer or platform admin
  if (!user?.is_employer && !isPlatformAdmin(user)) {
    return <Navigate to="/login" replace />;
  }

  // Check admin requirement (platform admin sees admin panel)
  if (requireAdmin && !isPlatformAdmin(user)) {
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
    // Redirect based on user type (platform admin -> admin panel)
    if (isPlatformAdmin(user)) {
      return <Navigate to="/admin" replace />;
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

        {/* Employer Onboarding - accessible by authenticated users */}
        <Route path="/onboarding" element={<EmployerOnboardingPage />} />

        {/* Protected Employer Routes */}
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
          <Route path="company" element={<CompanyProfilePage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute requireAdmin>
              <EmployerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/applications" element={<EmployerApplicationsPage />} />
          <Route path="admin/applications/:id" element={<ReviewApplicationPage />} />
          <Route path="admin/profiles" element={<ProfilesManagementPage />} />
          <Route path="admin/profiles/:id" element={<AdminProfileDetailPage />} />
          <Route path="admin/jobs" element={<JobsManagementPage />} />
          <Route path="admin/jobs/:id" element={<AdminJobDetailPage />} />
          <Route path="admin/companies" element={<CompaniesManagementPage />} />
          <Route path="admin/companies/:id" element={<AdminCompanyDetailPage />} />
          <Route path="admin/skills" element={<SkillsManagementPage />} />
        </Route>

        {/* Catch all - redirect to dashboard or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
