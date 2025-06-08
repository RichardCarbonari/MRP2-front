import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    if (location.pathname === '/login') {
        return null;
    }

    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                width: '100%',
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e1e4e8',
                mt: 'auto',
                py: { xs: 1.5, sm: 2 }
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: { xs: 'center', sm: 'space-between' },
                        alignItems: 'center',
                        gap: { xs: 1, sm: 2 },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}
                >
                    {/* Copyright */}
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            order: { xs: 2, sm: 1 }
                        }}
                    >
                        © {currentYear} <span style={{ color: '#2E7D32', fontWeight: '500' }}>MRP2</span>
                    </Typography>

                    {/* Links */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: { xs: 2, sm: 3 },
                            order: { xs: 1, sm: 2 }
                        }}
                    >
                        <Link
                            href="#"
                            color="text.secondary"
                            sx={{
                                textDecoration: 'none',
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                '&:hover': {
                                    color: '#2E7D32',
                                    textDecoration: 'underline'
                                },
                            }}
                        >
                            Suporte
                        </Link>
                        <Link
                            href="#"
                            color="text.secondary"
                            sx={{
                                textDecoration: 'none',
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                '&:hover': {
                                    color: '#2E7D32',
                                    textDecoration: 'underline'
                                },
                            }}
                        >
                            Contato
                        </Link>
                    </Box>

                    {/* Version */}
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            order: { xs: 3, sm: 3 }
                        }}
                    >
                        v2.1.0
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 