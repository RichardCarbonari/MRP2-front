import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Admin from './pages/Admin';
import Planning from './pages/Planning';
import CapacidadeProdutiva from './components/ProductiveCapacity';
import TeamDetailsPage from './pages/TeamDetailsPage';
import Financial from './pages/Financial';
import FinancialInput from './pages/FinancialInput';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1DB954',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/capacidade" element={<CapacidadeProdutiva />} />
            <Route path="/equipe/:teamId" element={<TeamDetailsPage />} />
            <Route path="/financeiro" element={<Financial />} />
            <Route path="/financeiro/entrada" element={<FinancialInput />} />
            <Route path="/" element={<CapacidadeProdutiva />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 