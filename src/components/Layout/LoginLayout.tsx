import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper
} from '@mui/material';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)'
      }}
    >
      {/* Header */}
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          MRP2
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,255,255,0.9)',
            mt: 1
          }}
        >
          Sistema de Gestão de Recursos de Manufatura
        </Typography>
      </Box>

      {/* Main Content */}
      <Container 
        maxWidth="sm" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          py: 3
        }}
      >
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {children}
        </Paper>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 2, 
          textAlign: 'center',
          color: 'rgba(255,255,255,0.8)'
        }}
      >
        <Typography variant="body2">
          © 2024 MRP2 Sistema de Gestão. Todos os direitos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginLayout; 