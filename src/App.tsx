import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { TimerProvider } from './contexts/TimerContext';
import { AppRoutes } from './routes';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <TimerProvider>
                    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
                        <AppRoutes />
                    </BrowserRouter>
                </TimerProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App; 