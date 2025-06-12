import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Chip,
    LinearProgress,
    CircularProgress
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useAuth } from '../../contexts/AuthContext';
import maintenanceService, { MaintenanceStats, MaintenanceRequest } from '../../services/maintenanceService';

const MaintenanceHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<MaintenanceStats | null>(null);
    const [recentRequests, setRecentRequests] = useState<MaintenanceRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsData, requestsData] = await Promise.all([
                maintenanceService.getStats(),
                user?.role === 'admin' || user?.role === 'maintenance'
                    ? maintenanceService.getAllRequests()
                    : maintenanceService.getUserRequests()
            ]);
            
            setStats(statsData);
            
            // Ordenar por data mais recente e pegar os 3 primeiros
            const sortedRequests = requestsData
                .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
                .slice(0, 3);
            
            setRecentRequests(sortedRequests);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const navigationButtons = [
        {
            title: 'Gestão de Pedidos',
            description: 'Visualize e resolva todos os pedidos de manutenção',
            icon: <AssignmentIcon sx={{ fontSize: 40, color: '#1DB954' }} />,
            path: '/maintenance-requests'
        }
    ];

    const getPriorityColor = (priority: string) => {
        return maintenanceService.getPriorityColor(priority);
    };

    const getStatusColor = (status: string) => {
        return maintenanceService.getStatusColor(status);
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMilliseconds = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 60) {
            return diffInMinutes <= 1 ? 'Agora há pouco' : `Há ${diffInMinutes} minutos`;
        } else if (diffInHours < 24) {
            return diffInHours === 1 ? 'Há 1 hora' : `Há ${diffInHours} horas`;
        } else if (diffInDays === 1) {
            return 'Ontem';
        } else if (diffInDays < 7) {
            return `Há ${diffInDays} dias`;
        } else {
            return date.toLocaleDateString('pt-BR');
        }
    };

    if (loading) {
        return (
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} sx={{ color: '#1DB954' }} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                        color: '#1DB954',
                        fontWeight: 'bold',
                        mb: 4,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: '60px',
                            height: '4px',
                            backgroundColor: '#1DB954',
                            borderRadius: '2px'
                        }
                    }}
                >
                    Bem-vindo, {user?.name}
                </Typography>

                {/* Botões de Navegação */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {navigationButtons.map((button) => (
                        <Grid item xs={12} md={4} key={button.title}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                                onClick={() => navigate(button.path)}
                            >
                                <CardContent sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 3
                                }}>
                                    {button.icon}
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            color: '#1DB954',
                                            mt: 2,
                                            mb: 1,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {button.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {button.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Estatísticas */}
                <Typography 
                    variant="h5" 
                    sx={{ 
                        mb: 3,
                        color: '#1DB954',
                        fontWeight: 'bold'
                    }}
                >
                    Visão Geral
                </Typography>

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {stats && [
                        {
                            title: 'Pedidos Pendentes',
                            value: stats.pending,
                            icon: <PendingIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
                            color: '#ff9800',
                            urgent: stats.highPriorityPending > 0
                        },
                        {
                            title: 'Em Andamento',
                            value: stats.inProgress,
                            icon: <BuildIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
                            color: '#2196f3'
                        },
                        {
                            title: 'Concluídos Hoje',
                            value: stats.completedToday,
                            icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
                            color: '#4caf50'
                        },
                        {
                            title: 'Alta Prioridade',
                            value: stats.highPriorityPending,
                            icon: <PriorityHighIcon sx={{ fontSize: 40, color: '#f44336' }} />,
                            color: '#f44336',
                            urgent: stats.highPriorityPending > 0
                        }
                    ].map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease',
                                    border: stat.urgent ? '2px solid #f44336' : 'none',
                                    backgroundColor: stat.urgent ? '#ffebee' : 'inherit',
                                    '&:hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        {stat.icon}
                                        <Typography 
                                            variant="h4" 
                                            sx={{ 
                                                ml: 2,
                                                color: stat.color,
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Typography 
                                        variant="body1"
                                        sx={{ 
                                            color: 'text.secondary',
                                            fontWeight: 500
                                        }}
                                    >
                                        {stat.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Pedidos Recentes */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            color: '#1DB954',
                            fontWeight: 'bold'
                        }}
                    >
                        Últimos Pedidos (3 mais recentes)
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {recentRequests.map((request) => (
                        <Grid item xs={12} md={4} key={request.id}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer',
                                    border: request.priority === 'Alta' && request.status === 'Pendente' 
                                        ? '2px solid #f44336' : 'none',
                                    '&:hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                                onClick={() => navigate('/maintenance-requests')}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#1DB954' }}>
                                            {request.equipment}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {request.id.slice(0, 8)}...
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <Chip 
                                            label={request.priority}
                                            size="small"
                                            sx={{ 
                                                backgroundColor: `${getPriorityColor(request.priority)}22`,
                                                color: getPriorityColor(request.priority),
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <Chip 
                                            label={request.status}
                                            size="small"
                                            sx={{ 
                                                backgroundColor: `${getStatusColor(request.status)}22`,
                                                color: getStatusColor(request.status),
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Solicitado: {getTimeAgo(request.requestedAt)}
                                    </Typography>

                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        {request.description.length > 100 
                                            ? `${request.description.substring(0, 100)}...` 
                                            : request.description}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Progresso
                                        </Typography>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={
                                                request.status === 'Concluída' ? 100 :
                                                request.status === 'Em Andamento' ? 50 :
                                                request.status === 'Agendada' ? 25 : 0
                                            }
                                            sx={{ 
                                                mt: 1,
                                                backgroundColor: 'rgba(0,0,0,0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: '#1DB954'
                                                }
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default MaintenanceHome; 