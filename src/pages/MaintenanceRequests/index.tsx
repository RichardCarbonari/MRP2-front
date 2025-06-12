import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid,
    Card,
    CardContent,
    Fade,
    Alert,
    Snackbar,
    CircularProgress,
    Tooltip,
    Divider,

} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import RefreshIcon from '@mui/icons-material/Refresh';

import maintenanceService, { MaintenanceRequest, MaintenanceStats } from '../../services/maintenanceService';
import { useAuth } from '../../contexts/AuthContext';

const MaintenanceManagement = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [stats, setStats] = useState<MaintenanceStats | null>(null);
    
    // Estados para atualização
    const [newStatus, setNewStatus] = useState('');
    const [solution, setSolution] = useState('');
    const [notes, setNotes] = useState('');
    
    // Estados para filtros
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    
    // Estados gerais
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const statuses = ['Pendente', 'Em Andamento', 'Agendada', 'Concluída'];
    const priorities = ['Alta', 'Média', 'Baixa'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await Promise.all([
            loadRequests(),
            loadStats()
        ]);
    };

    const loadRequests = async () => {
        try {
            setLoading(true);
            const filters = {
                status: statusFilter || undefined,
                priority: priorityFilter || undefined
            };
            const data = await maintenanceService.getAllRequests(filters);
            setRequests(data);
        } catch (error) {
            console.error('Error loading requests:', error);
            showMessage('Erro ao carregar as solicitações', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await maintenanceService.getStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const showMessage = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleViewRequest = (request: MaintenanceRequest) => {
        setSelectedRequest(request);
        setIsViewDialogOpen(true);
    };

    const handleUpdateRequest = (request: MaintenanceRequest) => {
        setSelectedRequest(request);
        setNewStatus(request.status);
        setSolution('');
        setNotes('');
        setIsUpdateDialogOpen(true);
    };

    const handleAssignToMe = async (request: MaintenanceRequest) => {
        try {
            await maintenanceService.assignRequest(request.id, user?.name || 'Técnico');
            showMessage('Pedido atribuído com sucesso!', 'success');
            loadData();
        } catch (error) {
            showMessage('Erro ao atribuir pedido', 'error');
        }
    };

    const handleSubmitUpdate = async () => {
        if (!selectedRequest) return;

        try {
            await maintenanceService.updateRequest(selectedRequest.id, {
                status: newStatus as any,
                solution: solution || undefined,
                notes: notes || undefined
            });

            showMessage('Pedido atualizado com sucesso!', 'success');
            setIsUpdateDialogOpen(false);
            loadData();
        } catch (error) {
            showMessage('Erro ao atualizar pedido', 'error');
        }
    };

    const handleClearFilters = () => {
        setStatusFilter('');
        setPriorityFilter('');
    };

    useEffect(() => {
        loadRequests();
    }, [statusFilter, priorityFilter]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pendente':
                return <PendingIcon />;
            case 'Em Andamento':
                return <BuildIcon />;
            case 'Agendada':
                return <ScheduleIcon />;
            case 'Concluída':
                return <CheckCircleIcon />;
            default:
                return <AssignmentIcon />;
        }
    };

    const filteredRequests = requests;

    // Separar pedidos por status
    const activeRequests = filteredRequests.filter(request => request.status !== 'Concluída');
    const completedRequests = filteredRequests.filter(request => request.status === 'Concluída');



    return (
        <Fade in={true} timeout={800}>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                {/* Header */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4 
                }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            color: '#1DB954', 
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <BuildIcon fontSize="large" />
                        Gestão de Manutenção - {user?.name}
                    </Typography>
                    
                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={loadData}
                        sx={{ 
                            bgcolor: '#1DB954',
                            '&:hover': { bgcolor: '#18a34b' }
                        }}
                    >
                        Atualizar
                    </Button>
                </Box>

                {/* Dashboard Stats */}
                {stats && (
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {[
                            {
                                title: 'Pedidos Pendentes',
                                value: stats.pending,
                                icon: <PendingIcon />,
                                color: '#ff9800',
                                urgent: stats.highPriorityPending > 0
                            },
                            {
                                title: 'Em Andamento',
                                value: stats.inProgress,
                                icon: <BuildIcon />,
                                color: '#2196f3'
                            },
                            {
                                title: 'Concluídos Hoje',
                                value: stats.completedToday,
                                icon: <CheckCircleIcon />,
                                color: '#4caf50'
                            },
                            {
                                title: 'Alta Prioridade',
                                value: stats.highPriorityPending,
                                icon: <PriorityHighIcon />,
                                color: '#f44336',
                                urgent: stats.highPriorityPending > 0
                            }
                        ].map((stat, index) => (
                            <Grid item xs={12} sm={6} lg={3} key={index}>
                                <Card sx={{ 
                                    backgroundColor: stat.urgent ? '#ffebee' : 'inherit',
                                    border: stat.urgent ? '2px solid #f44336' : 'none'
                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ color: stat.color }}>
                                                {stat.icon}
                                            </Box>
                                            <Box>
                                                <Typography variant="h4" sx={{ 
                                                    color: stat.color, 
                                                    fontWeight: 'bold' 
                                                }}>
                                                    {stat.value}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {stat.title}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Filtros */}
                <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1DB954' }}>
                        Filtros
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} lg={3}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {statuses.map((status) => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <TextField
                                select
                                fullWidth
                                label="Prioridade"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {priorities.map((priority) => (
                                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={3}>
                            <Button
                                startIcon={<FilterListIcon />}
                                onClick={handleClearFilters}
                                sx={{ 
                                    color: '#1DB954',
                                    width: { xs: '100%', lg: 'auto' }
                                }}
                                size="small"
                            >
                                Limpar Filtros
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Lista de Pedidos Ativos */}
                <Paper sx={{ width: '100%', mb: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ color: '#1DB954' }}>
                            Pedidos Ativos ({activeRequests.length})
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : activeRequests.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                Nenhum pedido ativo encontrado
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
                            <Table stickyHeader sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: 150, fontWeight: 'bold' }}>Equipamento</TableCell>
                                        <TableCell sx={{ minWidth: 200, fontWeight: 'bold' }}>Descrição</TableCell>
                                        <TableCell sx={{ minWidth: 120, fontWeight: 'bold' }}>Solicitante</TableCell>
                                        <TableCell sx={{ minWidth: 120, fontWeight: 'bold' }}>Departamento</TableCell>
                                        <TableCell align="center" sx={{ minWidth: 100, fontWeight: 'bold' }}>Prioridade</TableCell>
                                        <TableCell align="center" sx={{ minWidth: 120, fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ minWidth: 100, fontWeight: 'bold' }}>Data</TableCell>
                                        <TableCell align="right" sx={{ minWidth: 140, fontWeight: 'bold' }}>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {activeRequests.map((request) => (
                                        <TableRow 
                                            key={request.id}
                                            sx={{ 
                                                backgroundColor: request.priority === 'Alta' && request.status === 'Pendente' 
                                                    ? '#ffebee' : 'inherit',
                                                '&:hover': { backgroundColor: '#f5f5f5' }
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                    {request.equipment}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ 
                                                    maxWidth: 300,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {request.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {request.requestedByName || request.requestedBy}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{request.department}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={request.priority}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${maintenanceService.getPriorityColor(request.priority)}22`,
                                                        color: maintenanceService.getPriorityColor(request.priority),
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    icon={getStatusIcon(request.status)}
                                                    label={request.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${maintenanceService.getStatusColor(request.status)}22`,
                                                        color: maintenanceService.getStatusColor(request.status),
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption">
                                                    {new Date(request.requestedAt).toLocaleDateString('pt-BR')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Ver detalhes">
                                                    <IconButton 
                                                        onClick={() => handleViewRequest(request)}
                                                        sx={{ color: '#1DB954' }}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                
                                                {request.status === 'Pendente' && (
                                                    <Tooltip title="Aceitar pedido">
                                                        <IconButton 
                                                            onClick={() => handleAssignToMe(request)}
                                                            sx={{ color: '#2196f3' }}
                                                        >
                                                            <PlayArrowIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                
                                                {request.status !== 'Concluída' && (
                                                    <Tooltip title="Atualizar status">
                                                        <IconButton 
                                                            onClick={() => handleUpdateRequest(request)}
                                                            sx={{ color: '#ff9800' }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                {/* Lista de Pedidos Concluídos */}
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ color: '#4caf50' }}>
                            Pedidos Concluídos ({completedRequests.length})
                        </Typography>
                    </Box>

                    {completedRequests.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                Nenhum pedido concluído encontrado
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
                            <Table stickyHeader sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: 150, fontWeight: 'bold' }}>Equipamento</TableCell>
                                        <TableCell sx={{ minWidth: 200, fontWeight: 'bold' }}>Descrição</TableCell>
                                        <TableCell sx={{ minWidth: 120, fontWeight: 'bold' }}>Solicitante</TableCell>
                                        <TableCell sx={{ minWidth: 120, fontWeight: 'bold' }}>Departamento</TableCell>
                                        <TableCell align="center" sx={{ minWidth: 100, fontWeight: 'bold' }}>Prioridade</TableCell>
                                        <TableCell align="center" sx={{ minWidth: 120, fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ minWidth: 100, fontWeight: 'bold' }}>Data</TableCell>
                                        <TableCell align="right" sx={{ minWidth: 120, fontWeight: 'bold' }}>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {completedRequests.map((request) => (
                                        <TableRow 
                                            key={request.id}
                                            sx={{ 
                                                backgroundColor: '#f1f8e9',
                                                '&:hover': { backgroundColor: '#e8f5e8' }
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                    {request.equipment}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ 
                                                    maxWidth: 300,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {request.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {request.requestedByName || request.requestedBy}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{request.department}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={request.priority}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${maintenanceService.getPriorityColor(request.priority)}22`,
                                                        color: maintenanceService.getPriorityColor(request.priority),
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    icon={getStatusIcon(request.status)}
                                                    label={request.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#4caf5022',
                                                        color: '#4caf50',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption">
                                                    {new Date(request.requestedAt).toLocaleDateString('pt-BR')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Ver detalhes">
                                                    <IconButton 
                                                        onClick={() => handleViewRequest(request)}
                                                        sx={{ color: '#4caf50' }}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                {/* Dialog para Ver Detalhes */}
                <Dialog
                    open={isViewDialogOpen}
                    onClose={() => setIsViewDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ backgroundColor: '#1DB954', color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BuildIcon />
                            Detalhes do Pedido de Manutenção
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        {selectedRequest && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Equipamento
                                    </Typography>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        {selectedRequest.equipment}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Status Atual
                                    </Typography>
                                    <Chip
                                        icon={getStatusIcon(selectedRequest.status)}
                                        label={selectedRequest.status}
                                        sx={{
                                            backgroundColor: `${maintenanceService.getStatusColor(selectedRequest.status)}22`,
                                            color: maintenanceService.getStatusColor(selectedRequest.status),
                                            fontWeight: 'bold',
                                            mb: 2
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Descrição do Problema
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                                        {selectedRequest.description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Solicitado por
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedRequest.requestedByName || selectedRequest.requestedBy}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Departamento
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedRequest.department}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Prioridade
                                    </Typography>
                                    <Chip
                                        label={selectedRequest.priority}
                                        sx={{
                                            backgroundColor: `${maintenanceService.getPriorityColor(selectedRequest.priority)}22`,
                                            color: maintenanceService.getPriorityColor(selectedRequest.priority),
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Data da Solicitação
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(selectedRequest.requestedAt).toLocaleString('pt-BR')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsViewDialogOpen(false)}>
                            Fechar
                        </Button>
                        {selectedRequest && selectedRequest.status !== 'Concluída' && (
                            <Button 
                                variant="contained"
                                onClick={() => {
                                    setIsViewDialogOpen(false);
                                    handleUpdateRequest(selectedRequest);
                                }}
                                sx={{ bgcolor: '#1DB954', '&:hover': { bgcolor: '#18a34b' } }}
                            >
                                Atualizar Status
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                {/* Dialog para Atualizar Status */}
                <Dialog
                    open={isUpdateDialogOpen}
                    onClose={() => setIsUpdateDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ backgroundColor: '#1DB954', color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EditIcon />
                            Atualizar Pedido de Manutenção
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 4, pb: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Novo Status</InputLabel>
                                    <Select
                                        value={newStatus}
                                        label="Novo Status"
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        sx={{ minHeight: 56 }}
                                    >
                                        {statuses.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {getStatusIcon(status)}
                                                    {status}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            {newStatus === 'Concluída' && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 3 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>
                                                Informações de Conclusão
                                            </Typography>
                                        </Divider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Solução Aplicada"
                                            value={solution}
                                            onChange={(e) => setSolution(e.target.value)}
                                            multiline
                                            rows={4}
                                            placeholder="Descreva a solução aplicada para resolver o problema..."
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    padding: '12px 14px',
                                                },
                                                '& .MuiInputBase-inputMultiline': {
                                                    padding: '0 !important',
                                                }
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Observações"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    multiline
                                    rows={3}
                                    placeholder="Adicione observações sobre o atendimento..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            padding: '12px 14px',
                                        },
                                        '& .MuiInputBase-inputMultiline': {
                                            padding: '0 !important',
                                        },
                                        '& .MuiFormLabel-root': {
                                            backgroundColor: 'white',
                                            padding: '0 8px',
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsUpdateDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={handleSubmitUpdate}
                            disabled={newStatus === 'Concluída' && !solution.trim()}
                            sx={{ bgcolor: '#1DB954', '&:hover': { bgcolor: '#18a34b' } }}
                        >
                            Atualizar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar para mensagens */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </Fade>
    );
};

export default MaintenanceManagement; 