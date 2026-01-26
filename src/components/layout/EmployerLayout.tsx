import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { X } from '@phosphor-icons/react';
import EmployerSidebar from './EmployerSidebar';
import EmployerHeader from './EmployerHeader';

const EmployerLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 glass-card border-r border-gray-100/50 fixed h-screen overflow-y-auto">
        <EmployerSidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed left-0 top-0 bottom-0 w-72 glass-card shadow-glass-lg animate-slide-up">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-xl transition-colors"
                aria-label="Close menu"
              >
                <X weight="bold" className="w-5 h-5" />
              </button>
            </div>
            <EmployerSidebar onClose={() => setIsSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <EmployerHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployerLayout;
