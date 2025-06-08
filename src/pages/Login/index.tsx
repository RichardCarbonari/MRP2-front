import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      
      // Redirecionar baseado no papel do usuário
      switch (user.role) {
        case 'admin':
          navigate('/admin-home');
          break;
        case 'maintenance':
          navigate('/maintenance-home');
          break;
        case 'employee':
          navigate('/employee-home');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordOpen(true);
    setError('');
  };

  const handleForgotPasswordSubmit = () => {
    // Simulação simples de recuperação de senha
    if (!forgotPasswordEmail) {
      setForgotPasswordMessage('Por favor, digite seu email.');
      return;
    }

    // Lista de emails válidos do sistema
    const validEmails = [
      'carlos.diretor@mrp2cpu.com.br',
      'joao.manutencao@mrp2cpu.com.br',
      'maria.substrato@mrp2cpu.com.br',
      'pedro.substrato@mrp2cpu.com.br',
      'ana.bonding@mrp2cpu.com.br',
      'lucas.bonding@mrp2cpu.com.br',
      'patricia.encaps@mrp2cpu.com.br',
      'rodrigo.encaps@mrp2cpu.com.br',
      'fernanda.teste@mrp2cpu.com.br',
      'rafael.teste@mrp2cpu.com.br',
      'juliana.embalagem@mrp2cpu.com.br',
      'marcos.embalagem@mrp2cpu.com.br'
    ];

    if (validEmails.includes(forgotPasswordEmail)) {
      setForgotPasswordMessage('✅ Instruções de recuperação enviadas para seu email!');
    } else {
      setForgotPasswordMessage('❌ Email não encontrado no sistema.');
    }
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordEmail('');
    setForgotPasswordMessage('');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          
          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{
                  textDecoration: 'none',
                  color: '#2E7D32',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Esqueci minha senha
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>

      {/* Dialog para recuperação de senha */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={handleCloseForgotPassword}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            🔑 Recuperar Senha
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Digite seu email para receber instruções de recuperação de senha.
          </Typography>
          
          {forgotPasswordMessage && (
            <Alert 
              severity={forgotPasswordMessage.includes('✅') ? 'success' : 'error'}
              sx={{ mb: 2 }}
            >
              {forgotPasswordMessage}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            placeholder="seu.email@mrp2cpu.com.br"
          />
          
          <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
            💡 <strong>Dica:</strong> Use um dos emails válidos do sistema para testar a funcionalidade.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword}>
            Cancelar
          </Button>
          <Button 
            onClick={handleForgotPasswordSubmit}
            variant="contained"
            sx={{ backgroundColor: '#2E7D32' }}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login; 
