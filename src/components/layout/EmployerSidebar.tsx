import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  House,
  Briefcase,
  Buildings,
  SignOut,
  List,
} from '@phosphor-icons/react';
import { useAuth } from '../../hooks/useAuth';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-primary-500 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
      }`
    }
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="font-medium">{label}</span>
  </NavLink>
);

interface EmployerSidebarProps {
  onClose?: () => void;
}

const EmployerSidebar: React.FC<EmployerSidebarProps> = ({ onClose }) => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100/50">
        <div className="flex items-center gap-3">
          <img
            src="/logo_dark.jpeg"
            alt="Worket"
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div>
            <h1 className="font-bold text-gray-900">Worket</h1>
            <p className="text-xs text-gray-500">
              {isAdmin ? 'Admin Panel' : 'Employer Dashboard'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" onClick={onClose}>
        {isAdmin ? (
          // Admin Navigation
          <>
            <NavItem
              to="/admin/applications"
              icon={<List weight="bold" className="w-5 h-5" />}
              label="Applications"
              end
            />
          </>
        ) : (
          // Employer Navigation
          <>
            <NavItem
              to="/"
              icon={<House weight="bold" className="w-5 h-5" />}
              label="Dashboard"
              end
            />
            <NavItem
              to="/jobs"
              icon={<Briefcase weight="bold" className="w-5 h-5" />}
              label="Jobs"
            />
            <NavItem
              to="/company"
              icon={<Buildings weight="bold" className="w-5 h-5" />}
              label="Company"
            />
          </>
        )}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-100/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <SignOut weight="bold" className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default EmployerSidebar;
