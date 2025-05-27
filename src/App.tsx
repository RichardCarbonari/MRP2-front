import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TimerProvider } from './contexts/TimerContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import MaintenanceHome from './pages/MaintenanceHome';
import MaintenanceRequests from './pages/MaintenanceRequests';
import AdminHome from './pages/AdminHome';
import EmployeeHome from './pages/EmployeeHome';
import Admin from './pages/Admin';
import Employee from './pages/Employee';
import Planning from './pages/Planning';
import TeamsManagement from './pages/TeamsManagement';
import Inventory from './pages/Inventory';
import QualityAdmin from './pages/QualityAdmin';
import QualityRegister from './pages/QualityRegister';
import Financial from './pages/Financial';
import FinancialInput from './pages/FinancialInput';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        const redirectPath = user ? `/${user.role}-home` : '/login';
        return <Navigate to={redirectPath} />;
    }

    return <Layout>{children}</Layout>;
};

// Root Component
const Root = () => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" />;
    }

    return <Navigate to={`/${user.role}-home`} />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <TimerProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Root />} />
                            
                            {/* Admin Routes */}
                            <Route 
                                path="/admin-home" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminHome />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/admin" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Admin />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/planning" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Planning />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/teams-management" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <TeamsManagement />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/inventory" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Inventory />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/quality-admin" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <QualityAdmin />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/financial" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Financial />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/maintenance" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Maintenance />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/settings" 
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Settings />
                                    </ProtectedRoute>
                                } 
                            />

                            {/* Employee Routes */}
                            <Route 
                                path="/employee-home" 
                                element={
                                    <ProtectedRoute allowedRoles={['employee']}>
                                        <EmployeeHome />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/employee" 
                                element={
                                    <ProtectedRoute allowedRoles={['employee']}>
                                        <Employee />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/quality-register" 
                                element={
                                    <ProtectedRoute allowedRoles={['employee']}>
                                        <QualityRegister />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/financial-input" 
                                element={
                                    <ProtectedRoute allowedRoles={['employee']}>
                                        <FinancialInput />
                                    </ProtectedRoute>
                                } 
                            />

                            {/* Maintenance Routes */}
                            <Route 
                                path="/maintenance-home" 
                                element={
                                    <ProtectedRoute allowedRoles={['maintenance']}>
                                        <MaintenanceHome />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/maintenance-requests" 
                                element={
                                    <ProtectedRoute allowedRoles={['maintenance']}>
                                        <MaintenanceRequests />
                                    </ProtectedRoute>
                                } 
                            />

                            {/* Fallback route */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </BrowserRouter>
                </TimerProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App; 