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
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email as EmailIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
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
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<{id: string, email: string, name: string, role: string} | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetStep, setResetStep] = useState('email'); // 'email' or 'password'

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

  const handleForgotPasswordSubmit = async () => {
    if (resetStep === 'email') {
      // Verificar se email existe
      if (!forgotPasswordEmail) {
        setForgotPasswordMessage('Por favor, digite seu email.');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: forgotPasswordEmail })
        });

        const data = await response.json();

        if (response.ok) {
          setEmailVerified(true);
          setVerifiedUser(data.user);
          setResetStep('password');
          setForgotPasswordMessage(`✅ Email encontrado! Olá ${data.user.name}, agora você pode definir uma nova senha.`);
        } else {
          setForgotPasswordMessage('❌ Email não encontrado no sistema.');
        }
      } catch (error) {
        console.error('Erro ao verificar email:', error);
        setForgotPasswordMessage('❌ Erro de conexão. Tente novamente.');
      } finally {
        setLoading(false);
      }
    } else {
      // Redefinir senha
      if (!newPassword || !confirmPassword) {
        setForgotPasswordMessage('Por favor, preencha todos os campos.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setForgotPasswordMessage('❌ As senhas não conferem.');
        return;
      }

      if (newPassword.length < 6) {
        setForgotPasswordMessage('❌ A senha deve ter pelo menos 6 caracteres.');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: forgotPasswordEmail,
            newPassword: newPassword 
          })
        });

        const data = await response.json();

        if (response.ok) {
          setForgotPasswordMessage('✅ Senha alterada com sucesso! Você já pode fazer login com a nova senha.');
          setTimeout(() => {
            handleCloseForgotPassword();
          }, 2000);
        } else {
          setForgotPasswordMessage(`❌ ${data.error || 'Erro ao alterar senha'}`);
        }
      } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        setForgotPasswordMessage('❌ Erro de conexão. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordEmail('');
    setForgotPasswordMessage('');
    setEmailVerified(false);
    setVerifiedUser(null);
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setLoading(false);
    setResetStep('email');
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {resetStep === 'email' ? <EmailIcon sx={{ color: '#2E7D32' }} /> : <LockIcon sx={{ color: '#2E7D32' }} />}
            <Typography variant="h6" component="div">
              {resetStep === 'email' ? '🔍 Verificar Email' : '🔑 Nova Senha'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {resetStep === 'email' ? (
            <>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Digite seu email para verificar se existe no sistema. Se encontrado, você poderá definir uma nova senha.
              </Typography>
              
              <TextField
                autoFocus
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="usuario@mrp2.com"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
                💡 <strong>Emails válidos:</strong> carlos.diretor@mrp2cpu.com.br, funcionario@mrp2.com, joao.manutencao@mrp2cpu.com.br
              </Typography>
            </>
          ) : (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon />
                  <Typography variant="body2">
                    Email verificado! Usuário: <strong>{verifiedUser?.name}</strong>
                  </Typography>
                </Box>
              </Alert>
              
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Agora defina uma nova senha para sua conta.
              </Typography>
              
              <TextField
                autoFocus
                margin="dense"
                label="Nova Senha"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="dense"
                label="Confirmar Nova Senha"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
                💡 A senha deve ter pelo menos 6 caracteres.
              </Typography>
            </>
          )}
          
          {forgotPasswordMessage && (
            <Alert 
              severity={forgotPasswordMessage.includes('✅') ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {forgotPasswordMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseForgotPassword}
            disabled={loading}
          >
            Cancelar
          </Button>
          {resetStep === 'password' && (
            <Button 
              onClick={() => setResetStep('email')}
              disabled={loading}
              sx={{ color: '#666' }}
            >
              Voltar
            </Button>
          )}
          <Button 
            onClick={handleForgotPasswordSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ backgroundColor: '#2E7D32' }}
          >
            {loading ? 'Processando...' : (resetStep === 'email' ? 'Verificar Email' : 'Alterar Senha')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login; 
