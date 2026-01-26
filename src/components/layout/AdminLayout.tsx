import React from 'react';
import EmployerLayout from './EmployerLayout';

// AdminLayout reuses EmployerLayout but the sidebar shows admin navigation
// based on user.is_staff check in EmployerSidebar
const AdminLayout: React.FC = () => {
  return <EmployerLayout />;
};

export default AdminLayout;
