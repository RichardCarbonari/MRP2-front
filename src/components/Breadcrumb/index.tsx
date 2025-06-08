import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAuth } from '../../contexts/AuthContext';

const Breadcrumb = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userType } = useAuth();

    const getPageInfo = (pathname: string) => {
        const routes: Record<string, string> = {
            '/admin-home': 'Dashboard',
            '/planning': 'Pedidos',
            '/teams-management': 'Equipes',
            '/inventory': 'Estoque',
            '/quality-admin': 'Qualidade',
            '/financial': 'Financeiro',
            '/maintenance': 'Manutenção',
            '/settings': 'Configurações',
            '/user-management': 'Usuários',
            
            '/employee-home': 'Dashboard',
            '/employee': 'Perfil',
            '/quality-register': 'Qualidade',
            
            '/maintenance-home': 'Dashboard',
            '/maintenance-requests': 'Solicitações',
            '/maintenance/management': 'Gerenciamento',
            
            '/financial-input': 'Financeiro',
        };

        return routes[pathname] || 'Página';
    };

    const getHomePath = () => {
        switch (userType) {
            case 'admin':
                return '/admin-home';
            case 'maintenance':
                return '/maintenance-home';
            case 'employee':
                return '/employee-home';
            default:
                return '/';
        }
    };

    const getHomeTitle = () => {
        switch (userType) {
            case 'admin':
                return 'Admin';
            case 'maintenance':
                return 'Manutenção';
            case 'employee':
                return 'Funcionário';
            default:
                return 'Home';
        }
    };

    // Não mostrar breadcrumb na página de login ou na home
    if (location.pathname === '/login' || location.pathname === getHomePath()) {
        return null;
    }

    const currentPageTitle = getPageInfo(location.pathname);
    const homePath = getHomePath();

    return (
        <Box 
            sx={{ 
                mb: { xs: 1, sm: 2 }, 
                display: { xs: 'none', sm: 'block' } // Hide on mobile
            }}
        >
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" sx={{ color: '#999' }} />}
                aria-label="breadcrumb"
                sx={{ fontSize: '0.875rem' }}
            >
                <Link
                    color="inherit"
                    onClick={() => navigate(homePath)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        color: '#666',
                        fontSize: '0.875rem',
                        '&:hover': {
                            color: '#2E7D32'
                        }
                    }}
                >
                    <HomeIcon sx={{ mr: 0.5, fontSize: '16px' }} />
                    {getHomeTitle()}
                </Link>
                <Typography
                    color="text.primary"
                    sx={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#333'
                    }}
                >
                    {currentPageTitle}
                </Typography>
            </Breadcrumbs>
        </Box>
    );
};

export default Breadcrumb; 