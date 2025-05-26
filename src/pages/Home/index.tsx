import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const navigationButtons = [
    { text: 'Área do Funcionário', path: '/funcionario' },
    { text: 'Planejamento', path: '/planejamento' },
    { text: 'Administração', path: '/admin' },
    { text: 'Financeiro', path: '/financeiro' },
    { text: 'Entrada Financeira', path: '/financeiro/entrada' },
    { text: 'Detalhes da Equipe', path: '/equipe/1' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Sistema MRP2
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {navigationButtons.map((button) => (
            <Grid item xs={12} sm={6} md={4} key={button.path}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate(button.path)}
                sx={{
                  height: '100px',
                  backgroundColor: '#1DB954',
                  '&:hover': {
                    backgroundColor: '#169c46',
                  },
                }}
              >
                {button.text}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 