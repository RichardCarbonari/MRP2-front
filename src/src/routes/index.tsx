import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import AdminLayout from '../components/Layout/AdminLayout';
import EmployeeLayout from '../components/Layout/EmployeeLayout';
import MaintenanceLayout from '../components/Layout/MaintenanceLayout';

// 🚀 LAZY LOADING - Páginas carregadas sob demanda para melhor performance
const Login = lazy(() => import('../pages/Login'));
const MaintenanceHome = lazy(() => import('../pages/MaintenanceHome'));
const MaintenanceRequests = lazy(() => import('../pages/MaintenanceRequests'));
const MaintenanceManagement = lazy(() => import('../pages/MaintenanceManagement'));
const AdminHome = lazy(() => import('../pages/AdminHome'));
const EmployeeHome = lazy(() => import('../pages/EmployeeHome'));
const Employee = lazy(() => import('../pages/Employee'));
const Planning = lazy(() => import('../pages/Planning'));
const TeamsManagement = lazy(() => import('../pages/TeamsManagement'));
const Inventory = lazy(() => import('../pages/Inventory'));
const QualityAdmin = lazy(() => import('../pages/QualityAdmin'));
const QualityRegister = lazy(() => import('../pages/QualityRegister'));
const Financial = lazy(() => import('../pages/Financial'));
const FinancialInput = lazy(() => import('../pages/FinancialInput'));
const Maintenance = lazy(() => import('../pages/Maintenance'));
const Settings = lazy(() => import('../pages/Settings'));
const UserManagement = lazy(() => import('../pages/UserManagement'));

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

  if (user.role === 'admin') { 
    return React.createElement(AdminLayout, null, children); 
  } else if (user.role === 'employee') { 
    return React.createElement(EmployeeLayout, null, children); 
  } else if (user.role === 'maintenance') { 
    return React.createElement(MaintenanceLayout, null, children); 
  } 
  return React.createElement(Layout, null, children);
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

      {/* Maintenance Routes */}
      <Route path="/maintenance-home" element={<MaintenanceLayout><MaintenanceHome /></MaintenanceLayout>} />
      <Route path="/maintenance-requests" element={<MaintenanceLayout><MaintenanceRequests /></MaintenanceLayout>} />
      <Route path="/maintenance-management" element={<MaintenanceLayout><MaintenanceManagement /></MaintenanceLayout>} />

      {/* Fallback Route */}
      <Route path="*" element={<Root />} />
    </Routes>
  );
}; 