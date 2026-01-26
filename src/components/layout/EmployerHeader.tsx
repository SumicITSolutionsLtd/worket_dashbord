import React from 'react';
import { useLocation } from 'react-router-dom';
import { List, Bell } from '@phosphor-icons/react';
import { useAuth } from '../../hooks/useAuth';

interface EmployerHeaderProps {
  onMenuClick: () => void;
}

const getPageTitle = (pathname: string, isAdmin: boolean): string => {
  if (isAdmin) {
    if (pathname.includes('/admin/applications')) return 'Employer Applications';
    return 'Admin Panel';
  }

  if (pathname === '/') return 'Dashboard';
  if (pathname === '/jobs') return 'Jobs';
  if (pathname === '/jobs/create') return 'Create Job';
  if (pathname.includes('/edit')) return 'Edit Job';
  if (pathname.includes('/applications')) return 'Applications';
  if (pathname.includes('/ai-shortlist')) return 'AI Shortlist';
  return 'Dashboard';
};

const EmployerHeader: React.FC<EmployerHeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const pageTitle = getPageTitle(location.pathname, isAdmin);

  return (
    <header className="glass-nav sticky top-0 z-40 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100/80 rounded-xl transition-colors"
            aria-label="Open menu"
          >
            <List weight="bold" className="w-6 h-6" />
          </button>

          <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications (placeholder) */}
          <button className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-xl transition-colors relative">
            <Bell weight="bold" className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User avatar (mobile) */}
          <div className="lg:hidden w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 text-sm font-medium">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default EmployerHeader;
