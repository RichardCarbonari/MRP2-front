import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { TimerProvider } from './contexts/TimerContext';
import { AppRoutes } from './routes';

// Componente de Loading otimizado
const LoadingFallback = () => (
    <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        flexDirection="column"
        gap={2}
    >
        <CircularProgress size={60} />
        <Box fontSize="1.1rem" color="text.secondary">
            Carregando...
        </Box>
    </Box>
);

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <TimerProvider>
                    <BrowserRouter future={{ 
                        v7_relativeSplatPath: true,
                        v7_startTransition: true 
                    }}>
                        <Suspense fallback={<LoadingFallback />}>
                            <AppRoutes />
                        </Suspense>
                    </BrowserRouter>
                </TimerProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App; 