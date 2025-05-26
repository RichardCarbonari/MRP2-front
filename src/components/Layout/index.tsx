import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminPanelSettings, EventNote, Speed, MonetizationOn } from '@mui/icons-material';

/**
 * Interface que define as propriedades do componente Layout
 * @interface LayoutProps
 * @property {React.ReactNode} children - Elementos filhos que serão renderizados dentro do layout
 */
interface LayoutProps {
    children: React.ReactNode;
}

/**
 * Componente que define o layout padrão da aplicação
 * Inclui a barra de navegação superior com links para as principais seções
 * @component
 * @param {LayoutProps} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado dentro do layout
 */
export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" sx={{ bgcolor: '#1DB954' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        MRP2 - Sistema de Produção
                    </Typography>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/admin')}
                        startIcon={<AdminPanelSettings />}
                        sx={{ 
                            bgcolor: isActive('/admin') ? 'rgba(0,0,0,0.1)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' }
                        }}
                    >
                        Gestão de Produção
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/planning')}
                        startIcon={<EventNote />}
                        sx={{ 
                            bgcolor: isActive('/planning') ? 'rgba(0,0,0,0.1)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' }
                        }}
                    >
                        Planejamento
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/capacidade')}
                        startIcon={<Speed />}
                        sx={{ 
                            bgcolor: isActive('/capacidade') ? 'rgba(0,0,0,0.1)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' }
                        }}
                    >
                        Capacidade Produtiva
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/financeiro')}
                        startIcon={<MonetizationOn />}
                        sx={{ 
                            bgcolor: isActive('/financeiro') ? 'rgba(0,0,0,0.1)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' }
                        }}
                    >
                        Financeiro
                    </Button>
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
} 