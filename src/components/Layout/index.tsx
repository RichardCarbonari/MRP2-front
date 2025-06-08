import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from './AdminLayout';
import EmployeeLayout from './EmployeeLayout';
import MaintenanceLayout from './MaintenanceLayout';
import LoginLayout from './LoginLayout';

/**
 * Interface que define as propriedades do componente Layout
 * @interface LayoutProps
 * @property {React.ReactNode} children - Elementos filhos que serão renderizados dentro do layout
 */
interface LayoutProps {
    children: React.ReactNode;
}

/**
 * Componente que define o layout baseado no tipo de usuário
 * Seleciona automaticamente o layout apropriado baseado no tipo de usuário logado
 * @component
 * @param {LayoutProps} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado dentro do layout
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    // Se não está autenticado, usa o layout de login
    if (!isAuthenticated || !user) {
        return <LoginLayout>{children}</LoginLayout>;
    }

    // Seleciona o layout baseado no tipo de usuário
    switch (user.role) {
        case 'admin':
            return <AdminLayout>{children}</AdminLayout>;
        case 'employee':
            return <EmployeeLayout>{children}</EmployeeLayout>;
        case 'maintenance':
            return <MaintenanceLayout>{children}</MaintenanceLayout>;
        default:
            return <LoginLayout>{children}</LoginLayout>;
    }
};

export default Layout; 