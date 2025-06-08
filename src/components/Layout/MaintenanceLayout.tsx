import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';
import Breadcrumb from '../Breadcrumb';

interface MaintenanceLayoutProps {
  children: React.ReactNode;
}

const MaintenanceLayout: React.FC<MaintenanceLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 7, sm: 8 }, // Account for fixed header
          px: { xs: 1, sm: 2, md: 3 },
          pb: 2
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            px: { xs: 1, sm: 2 },
            py: { xs: 1, sm: 2 }
          }}
        >
          <Breadcrumb />
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: { xs: 1, sm: 2 },
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              p: { xs: 2, sm: 3 },
              mt: 1,
              minHeight: { xs: 'calc(100vh - 180px)', sm: 'calc(100vh - 200px)' }
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default MaintenanceLayout; 