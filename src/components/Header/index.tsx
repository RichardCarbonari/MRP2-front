import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Container, 
  Box, 
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import InventoryIcon from '@mui/icons-material/Inventory';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BuildIcon from '@mui/icons-material/Build';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user, userType } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getMenuItems = () => {
        switch (userType) {
            case 'admin':
                return [
                    { text: 'Dashboard', path: '/admin-home', icon: DashboardIcon },
                    { text: 'Pedidos', path: '/planning', icon: AssignmentIcon },
                    { text: 'Equipes', path: '/teams-management', icon: GroupsIcon },
                    { text: 'Estoque', path: '/inventory', icon: InventoryIcon },
                    { text: 'Qualidade', path: '/quality-admin', icon: VerifiedIcon },
                    { text: 'Financeiro', path: '/financial', icon: AccountBalanceIcon },
                    { text: 'Manutenção', path: '/maintenance', icon: BuildIcon },
                    { text: 'Usuários', path: '/user-management', icon: PersonIcon },
                    { text: 'Configurações', path: '/settings', icon: SettingsIcon }
                ];
            case 'maintenance':
                return [
                    { text: 'Dashboard', path: '/maintenance-home', icon: DashboardIcon },
                    { text: 'Pedidos', path: '/maintenance-requests', icon: AssignmentIcon }
                ];
            case 'employee':
                return [
                    { text: 'Dashboard', path: '/employee-home', icon: DashboardIcon },
                    { text: 'Perfil', path: '/employee', icon: PersonIcon },
                    { text: 'Manutenção', path: '/employee-maintenance-requests', icon: BuildIcon },
                    { text: 'Qualidade', path: '/quality-register', icon: VerifiedIcon }
                ];
            default:
                return [];
        }
    };

    const getRoleColor = () => {
        switch (userType) {
            case 'admin':
                return '#2E7D32';
            case 'maintenance':
                return '#388E3C';
            case 'employee':
                return '#4CAF50';
            default:
                return '#66BB6A';
        }
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleProfileMenuClose();
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    if (location.pathname === '/login') {
        return null;
    }

    const menuItems = getMenuItems();
    const isProfileMenuOpen = Boolean(anchorEl);

    return (
        <>
            <AppBar 
                position="fixed" 
                sx={{ 
                    backgroundColor: '#fff',
                    color: '#333',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' } }}>
                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        {/* Logo */}
                        <Box 
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                mr: { xs: 0, md: 4 }
                            }}
                            onClick={() => navigate('/admin-home')}
                        >
                            <Box 
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '6px',
                                    background: `linear-gradient(135deg, ${getRoleColor()}, #4CAF50)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    mr: 1
                                }}
                            >
                                M2
                            </Box>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                MRP2
                            </Typography>
                        </Box>

                        {/* Desktop Navigation */}
                        {!isMobile && (
                            <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
                                {menuItems.slice(0, 7).map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Button
                                            key={item.path}
                                            onClick={() => navigate(item.path)}
                                            sx={{
                                                mx: 0.5,
                                                px: 2,
                                                py: 1,
                                                borderRadius: '6px',
                                                color: isActive ? getRoleColor() : '#666',
                                                backgroundColor: isActive ? `${getRoleColor()}10` : 'transparent',
                                                '&:hover': {
                                                    backgroundColor: `${getRoleColor()}15`,
                                                    color: getRoleColor()
                                                },
                                                textTransform: 'none',
                                                fontWeight: isActive ? '600' : '500',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            {item.text}
                                        </Button>
                                    );
                                })}
                            </Box>
                        )}

                        {/* Spacer for mobile */}
                        {isMobile && <Box sx={{ flexGrow: 1 }} />}

                        {/* User Avatar */}
                        <IconButton
                            onClick={handleProfileMenuOpen}
                            sx={{ p: 0 }}
                        >
                            <Avatar 
                                sx={{ 
                                    width: 36, 
                                    height: 36,
                                    backgroundColor: getRoleColor(),
                                    fontSize: '0.875rem'
                                }}
                            >
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 250,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Box sx={{ pt: 2, pb: 1 }}>
                    <List>
                        {menuItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <ListItem 
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        cursor: 'pointer',
                                        backgroundColor: isActive ? `${getRoleColor()}10` : 'transparent',
                                        borderRight: isActive ? `3px solid ${getRoleColor()}` : 'none',
                                        '&:hover': {
                                            backgroundColor: `${getRoleColor()}15`
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: isActive ? getRoleColor() : '#666' }}>
                                        <IconComponent />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.text}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                color: isActive ? getRoleColor() : '#333',
                                                fontWeight: isActive ? '600' : '400'
                                            }
                                        }}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Drawer>

            {/* User Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={isProfileMenuOpen}
                onClose={handleProfileMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        minWidth: '180px',
                        mt: 1
                    }
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
                        {user?.name || 'Usuário'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                        {user?.email || 'usuario@email.com'}
                    </Typography>
                </Box>
                <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
                    <SettingsIcon sx={{ mr: 2, fontSize: '18px' }} />
                    Configurações
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                    <LogoutIcon sx={{ mr: 2, fontSize: '18px' }} />
                    Sair
                </MenuItem>
            </Menu>
        </>
    );
};

export default Header; 