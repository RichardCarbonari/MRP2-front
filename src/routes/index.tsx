import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import AdminLayout from '../components/Layout/AdminLayout';
import EmployeeLayout from '../components/Layout/EmployeeLayout';
import MaintenanceLayout from '../components/Layout/MaintenanceLayout';

// Pages
import Login from '../pages/Login';
import MaintenanceHome from '../pages/MaintenanceHome';
import MaintenanceRequests from '../pages/MaintenanceRequests';
import MaintenanceManagement from '../pages/MaintenanceManagement';
import AdminHome from '../pages/AdminHome';
import EmployeeHome from '../pages/EmployeeHome';
import Employee from '../pages/Employee';
import Planning from '../pages/Planning';
import TeamsManagement from '../pages/TeamsManagement';
import Inventory from '../pages/Inventory';
import QualityAdmin from '../pages/QualityAdmin';
import QualityRegister from '../pages/QualityRegister';
import Financial from '../pages/Financial';
import FinancialInput from '../pages/FinancialInput';
import Maintenance from '../pages/Maintenance';
import Settings from '../pages/Settings';
import UserManagement from '../pages/UserManagement';
import EmployeeMaintenanceRequests from '../pages/EmployeeMaintenanceRequests';

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles: string[] 
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    const redirectPath = user ? `/${user.role}-home` : '/login';
    return <Navigate to={redirectPath} replace />;
  }

  if (user.role === 'admin') { return React.createElement(AdminLayout, null, children); } else if (user.role === 'employee') { return React.createElement(EmployeeLayout, null, children); } else if (user.role === 'maintenance') { return React.createElement(MaintenanceLayout, null, children); } return React.createElement(Layout, null, children);
};

// Root Component - Redirects to appropriate home page
const Root = () => {
  const { user, isAuthenticated, getHomePage } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getHomePage()} replace />;
};

// Routes Configuration
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/" element={<Root />} />
      
      {/* Admin Routes */}
      <Route path="/admin-home" element={<AdminLayout><AdminHome /></AdminLayout>} />
      <Route path="/planning" element={<AdminLayout><Planning /></AdminLayout>} />
      <Route path="/teams-management" element={<AdminLayout><TeamsManagement /></AdminLayout>} />
      <Route path="/inventory" element={<AdminLayout><Inventory /></AdminLayout>} />
      <Route path="/quality-admin" element={<AdminLayout><QualityAdmin /></AdminLayout>} />
      <Route path="/financial" element={<AdminLayout><Financial /></AdminLayout>} />
      <Route path="/maintenance" element={<AdminLayout><Maintenance /></AdminLayout>} />
      <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
      <Route path="/user-management" element={<AdminLayout><UserManagement /></AdminLayout>} />

      {/* Employee Routes */}
      <Route path="/employee-home" element={<EmployeeLayout><EmployeeHome /></EmployeeLayout>} />
      <Route path="/employee" element={<EmployeeLayout><Employee /></EmployeeLayout>} />
      <Route path="/quality-register" element={<EmployeeLayout><QualityRegister /></EmployeeLayout>} />
      <Route path="/financial-input" element={<EmployeeLayout><FinancialInput /></EmployeeLayout>} />
      <Route path="/employee-maintenance-requests" element={<EmployeeLayout><EmployeeMaintenanceRequests /></EmployeeLayout>} />

      {/* Maintenance Routes */}
      <Route path="/maintenance-home" element={<MaintenanceLayout><MaintenanceHome /></MaintenanceLayout>} />
      <Route path="/maintenance-requests" element={<MaintenanceLayout><MaintenanceRequests /></MaintenanceLayout>} />
      <Route path="/maintenance-management" element={<MaintenanceLayout><MaintenanceManagement /></MaintenanceLayout>} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/admin-home" replace />} />
    </Routes>
  );
};
