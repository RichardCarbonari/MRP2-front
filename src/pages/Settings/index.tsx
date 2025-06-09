import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
    Grid
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Lock as LockIcon,
    Key as KeyIcon,
    Security as SecurityIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ValidationErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const Settings = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<PasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (field: keyof PasswordFormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        
        // Limpar erro quando usuário começar a digitar
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
        
        // Limpar sucesso quando houver mudança
        if (success) {
            setSuccess(false);
        }
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Senha atual é obrigatória';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'Nova senha é obrigatória';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
        } else if (formData.newPassword === formData.currentPassword) {
            newErrors.newPassword = 'Nova senha deve ser diferente da atual';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (formData.confirmPassword !== formData.newPassword) {
            newErrors.confirmPassword = 'Confirmação não confere com a nova senha';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Erro de validação do servidor
                if (data.field) {
                    setErrors({ [data.field]: data.error });
                } else {
                    setErrors({ currentPassword: data.error || 'Erro ao alterar senha' });
                }
                return;
            }

            console.log('✅ Senha alterada com sucesso para usuário:', user?.name);
            
            setSuccess(true);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
        } catch (error) {
            console.error('❌ Erro ao alterar senha:', error);
            setErrors({ currentPassword: 'Erro de conexão. Tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: '', color: '' };
        if (password.length < 4) return { strength: 25, label: 'Fraca', color: '#f44336' };
        if (password.length < 6) return { strength: 50, label: 'Regular', color: '#ff9800' };
        if (password.length < 8) return { strength: 75, label: 'Boa', color: '#2196f3' };
        return { strength: 100, label: 'Forte', color: '#4caf50' };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 0 }}>
            {/* Header Verde */}
            <Box 
                sx={{ 
                    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: '0 0 20px 20px',
                    mb: 4,
                    boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)'
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SecurityIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: '600',
                                    fontSize: '2rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Configurações de Segurança
                            </Typography>
                            <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
                                Altere sua senha para manter sua conta segura
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="md">
                {success && (
                    <Alert 
                        icon={<CheckIcon fontSize="inherit" />}
                        severity="success" 
                        sx={{ 
                            mb: 3,
                            borderRadius: '12px',
                            '& .MuiAlert-icon': {
                                color: '#2E7D32'
                            }
                        }}
                    >
                        Senha alterada com sucesso! Sua conta está mais segura agora.
                    </Alert>
                )}

                <Paper 
                    sx={{ 
                        p: 4,
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid #e1e4e8'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <KeyIcon sx={{ color: '#2E7D32', mr: 2, fontSize: 28 }} />
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                color: '#2E7D32',
                                fontWeight: '600',
                                fontSize: '1.5rem'
                            }}
                        >
                            Alterar Senha
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Senha Atual */}
                            <Grid item xs={12}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: '#666666',
                                        mb: 1,
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    Senha Atual
                                </Typography>
                                <TextField
                                    fullWidth
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={formData.currentPassword}
                                    onChange={handleInputChange('currentPassword')}
                                    error={!!errors.currentPassword}
                                    helperText={errors.currentPassword}
                                    placeholder="Digite sua senha atual"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: '#666' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePasswordVisibility('current')}
                                                    edge="end"
                                                >
                                                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: '8px',
                                            backgroundColor: '#fafafa',
                                            '& input': {
                                                fontSize: '1rem'
                                            }
                                        }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e1e4e8',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#2E7D32',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#2E7D32',
                                                borderWidth: '2px'
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Nova Senha */}
                            <Grid item xs={12}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: '#666666',
                                        mb: 1,
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    Nova Senha
                                </Typography>
                                <TextField
                                    fullWidth
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={handleInputChange('newPassword')}
                                    error={!!errors.newPassword}
                                    helperText={errors.newPassword}
                                    placeholder="Digite sua nova senha"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <KeyIcon sx={{ color: '#666' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePasswordVisibility('new')}
                                                    edge="end"
                                                >
                                                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: '8px',
                                            backgroundColor: '#fafafa',
                                            '& input': {
                                                fontSize: '1rem'
                                            }
                                        }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e1e4e8',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#2E7D32',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#2E7D32',
                                                borderWidth: '2px'
                                            },
                                        },
                                    }}
                                />
                                
                                {/* Indicador de Força da Senha */}
                                {formData.newPassword && (
                                    <Box sx={{ mt: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Typography variant="caption" color="textSecondary">
                                                Força da senha:
                                            </Typography>
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: passwordStrength.color,
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {passwordStrength.label}
                                            </Typography>
                                        </Box>
                                        <Box 
                                            sx={{ 
                                                width: '100%',
                                                height: 4,
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: 2,
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box 
                                                sx={{
                                                    width: `${passwordStrength.strength}%`,
                                                    height: '100%',
                                                    backgroundColor: passwordStrength.color,
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                )}
                            </Grid>

                            {/* Confirmar Nova Senha */}
                            <Grid item xs={12}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: '#666666',
                                        mb: 1,
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    Confirmar Nova Senha
                                </Typography>
                                <TextField
                                    fullWidth
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange('confirmPassword')}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    placeholder="Confirme sua nova senha"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <KeyIcon sx={{ color: '#666' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePasswordVisibility('confirm')}
                                                    edge="end"
                                                >
                                                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: '8px',
                                            backgroundColor: '#fafafa',
                                            '& input': {
                                                fontSize: '1rem'
                                            }
                                        }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e1e4e8',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#2E7D32',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#2E7D32',
                                                borderWidth: '2px'
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Botão de Salvar */}
                            <Grid item xs={12}>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
                                        sx={{
                                            backgroundColor: '#2E7D32',
                                            '&:hover': {
                                                backgroundColor: '#1B5E20'
                                            },
                                            borderRadius: '8px',
                                            py: 1.5,
                                            px: 4,
                                            fontSize: '1rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {loading ? 'Alterando Senha...' : 'Alterar Senha'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>

                    {/* Dicas de Segurança */}
                    <Paper 
                        sx={{ 
                            mt: 4,
                            p: 3,
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e1e4e8',
                            borderRadius: '12px'
                        }}
                    >
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                color: '#2E7D32',
                                fontWeight: '600',
                                mb: 2
                            }}
                        >
                            💡 Dicas para uma senha segura:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                            <Typography component="li" variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                Use pelo menos 8 caracteres
                            </Typography>
                            <Typography component="li" variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                Combine letras maiúsculas, minúsculas, números e símbolos
                            </Typography>
                            <Typography component="li" variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                Evite informações pessoais óbvias
                            </Typography>
                            <Typography component="li" variant="body2" color="textSecondary">
                                Use senhas diferentes para cada conta
                            </Typography>
                        </Box>
                    </Paper>
                </Paper>
            </Container>
        </Box>
    );
};

export default Settings;