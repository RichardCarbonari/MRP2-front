import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    TextField,
    Switch,
    FormControlLabel,
    Alert,
} from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';

interface Settings {
    production: {
        defaultShiftDuration: number;
        qualityThreshold: number;
        maintenanceInterval: number;
    };
    system: {
        autoBackup: boolean;
        backupInterval: number;
    };
}

export default function AdminSettings() {
    const [settings, setSettings] = useState<Settings>({
        production: {
            defaultShiftDuration: 8,
            qualityThreshold: 90,
            maintenanceInterval: 30,
        },
        system: {
            autoBackup: true,
            backupInterval: 24,
        },
    });

    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleProductionChange = (key: keyof Settings['production'], value: number) => {
        setSettings(prev => ({
            ...prev,
            production: {
                ...prev.production,
                [key]: value,
            },
        }));
        // Auto-save simulation
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

    const handleSystemChange = (key: keyof Settings['system'], value: any) => {
        setSettings(prev => ({
            ...prev,
            system: {
                ...prev.system,
                [key]: value,
            },
        }));
        // Auto-save simulation
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

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
                <Container maxWidth="lg">
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: '600',
                            fontSize: '2rem',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Configurações do Sistema
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {saveSuccess && (
                    <Alert 
                        severity="success" 
                        sx={{ 
                            mb: 3,
                            borderRadius: '12px',
                            '& .MuiAlert-icon': {
                                color: '#2E7D32'
                            }
                        }}
                    >
                        Configurações salvas automaticamente!
                    </Alert>
                )}

                <Grid container spacing={4}>
                    {/* Parâmetros de Produção */}
                    <Grid item xs={12} md={6}>
                        <Paper 
                            sx={{ 
                                p: 4,
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                border: '1px solid #e1e4e8',
                                height: 'fit-content'
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                gutterBottom 
                                sx={{ 
                                    color: '#2E7D32',
                                    fontWeight: '600',
                                    mb: 3,
                                    fontSize: '1.4rem'
                                }}
                            >
                                Parâmetros de Produção
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: '#666666',
                                            mb: 1,
                                            fontSize: '0.9rem',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Duração Padrão do Turno (horas)
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={settings.production.defaultShiftDuration}
                                        onChange={(e) => handleProductionChange('defaultShiftDuration', Number(e.target.value))}
                                        InputProps={{ 
                                            inputProps: { min: 1, max: 24 },
                                            sx: {
                                                borderRadius: '8px',
                                                backgroundColor: '#fafafa',
                                                '& input': {
                                                    fontSize: '1.1rem',
                                                    fontWeight: '500'
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
                                </Box>

                                <Box>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: '#666666',
                                            mb: 1,
                                            fontSize: '0.9rem',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Limite de Qualidade (%)
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={settings.production.qualityThreshold}
                                        onChange={(e) => handleProductionChange('qualityThreshold', Number(e.target.value))}
                                        InputProps={{ 
                                            inputProps: { min: 0, max: 100 },
                                            sx: {
                                                borderRadius: '8px',
                                                backgroundColor: '#fafafa',
                                                '& input': {
                                                    fontSize: '1.1rem',
                                                    fontWeight: '500'
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
                                </Box>

                                <Box>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: '#666666',
                                            mb: 1,
                                            fontSize: '0.9rem',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Intervalo de Manutenção (dias)
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={settings.production.maintenanceInterval}
                                        onChange={(e) => handleProductionChange('maintenanceInterval', Number(e.target.value))}
                                        InputProps={{ 
                                            inputProps: { min: 1 },
                                            sx: {
                                                borderRadius: '8px',
                                                backgroundColor: '#fafafa',
                                                '& input': {
                                                    fontSize: '1.1rem',
                                                    fontWeight: '500'
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
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Backup do Sistema */}
                    <Grid item xs={12} md={6}>
                        <Paper 
                            sx={{ 
                                p: 4,
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                border: '1px solid #e1e4e8',
                                height: 'fit-content'
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                gutterBottom 
                                sx={{ 
                                    color: '#2E7D32',
                                    fontWeight: '600',
                                    mb: 3,
                                    fontSize: '1.4rem'
                                }}
                            >
                                Backup do Sistema
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CloudIcon sx={{ color: '#666666', fontSize: '1.5rem' }} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                color: '#333333',
                                                mb: 0.5
                                            }}
                                        >
                                            Backup Automático
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#666666',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Realizar backup automático dos dados
                                        </Typography>
                                    </Box>
                                    <Switch
                                        checked={settings.system.autoBackup}
                                        onChange={() => handleSystemChange('autoBackup', !settings.system.autoBackup)}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#2E7D32',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                                },
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#2E7D32',
                                            },
                                        }}
                                    />
                                </Box>

                                {settings.system.autoBackup && (
                                    <Box>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#666666',
                                                mb: 1,
                                                fontSize: '0.9rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Intervalo de Backup (horas)
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            value={settings.system.backupInterval}
                                            onChange={(e) => handleSystemChange('backupInterval', Number(e.target.value))}
                                            InputProps={{ 
                                                inputProps: { min: 1 },
                                                sx: {
                                                    borderRadius: '8px',
                                                    backgroundColor: '#fafafa',
                                                    '& input': {
                                                        fontSize: '1.1rem',
                                                        fontWeight: '500'
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
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
} 