import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    Fade,
    Alert,
    Snackbar,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useAuth } from '../../contexts/AuthContext';
import maintenanceService, { MaintenanceRequest, CreateMaintenanceRequest } from '../../services/maintenanceService';

const EmployeeMaintenanceRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Estados para novo pedido
    const [newRequest, setNewRequest] = useState<CreateMaintenanceRequest>({
        equipment: '',
        description: '',
        priority: 'Média',
        department: ''
    });
    
    // Estados para mensagens
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const priorities = ['Alta', 'Média', 'Baixa'];
    const departments = ['Montagem Substrato', 'Bonding', 'Encapsulamento', 'Testes', 'Embalagem'];
    
    // Equipamentos comuns por departamento
    const equipmentsByDepartment = {
        'Montagem Substrato': [
            'Pick & Place Machine ASMPT SIPLACE',
            'Máquina de Inspeção AOI',
            'Forno de Refusão SMT',
            'Impressora de Pasta de Solda',
            'Sistema de Visão COGNEX',
            'Estação de Rework Manual'
        ],
        'Bonding': [
            'Máquina de Wire Bonding ASM AB339',
            'Wire Bonder Kulicke & Soffa',
            'Microscópio de Inspeção Bonding',
            'Sistema de Aquecimento de Dies',
            'Ferramentas de Calibração',
            'Estação de Limpeza Ultrassônica'
        ],
        'Encapsulamento': [
            'Molding Press APIC Yamada YAP-300',
            'Sistema de Cura UV',
            'Máquina de Trim & Form',
            'Forno de Pós-Cura',
            'Sistema de Controle de Temperatura',
            'Estação de Deflash'
        ],
        'Testes': [
            'Sistema de Teste ATE Advantest T2000',
            'Testador de Burn-in',
            'Analisador de Espectro',
            'Osciloscópio Digital',
            'Gerador de Sinais',
            'Sistema de Teste Final'
        ],
        'Embalagem': [
            'Máquina de Marcação a Laser Coherent AVIA',
            'Sistema de Inspeção Final',
            'Seladora de Bandejas ESD',
            'Impressora de Etiquetas',
            'Teste de Continuidade ESD',
            'Estação de Embalagem Manual'
        ]
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await maintenanceService.getUserRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error loading requests:', error);
            showMessage('Erro ao carregar solicitações', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleCreateRequest = async () => {
        try {
            setSubmitting(true);
            await maintenanceService.createRequest(newRequest);
            showMessage('Solicitação de manutenção criada com sucesso!', 'success');
            setIsCreateDialogOpen(false);
            setNewRequest({
                equipment: '',
                description: '',
                priority: 'Média',
                department: ''
            });
            loadRequests();
        } catch (error) {
            showMessage('Erro ao criar solicitação', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewRequest = (request: MaintenanceRequest) => {
        setSelectedRequest(request);
        setIsViewDialogOpen(true);
    };

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

    const getStatusColor = (status: string) => {
        return maintenanceService.getStatusColor(status);
    };

    const getPriorityColor = (priority: string) => {
        return maintenanceService.getPriorityColor(priority);
    };

    const getEquipmentOptions = () => {
        if (!newRequest.department) return [];
        return equipmentsByDepartment[newRequest.department as keyof typeof equipmentsByDepartment] || [];
    };

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
                        Meus Pedidos de Manutenção
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={loadRequests}
                            sx={{ 
                                borderColor: '#1DB954',
                                color: '#1DB954',
                                '&:hover': { borderColor: '#18a34b', backgroundColor: '#f0f8f4' }
                            }}
                        >
                            Atualizar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsCreateDialogOpen(true)}
                            sx={{ 
                                bgcolor: '#1DB954',
                                '&:hover': { bgcolor: '#18a34b' }
                            }}
                        >
                            Nova Solicitação
                        </Button>
                    </Box>
                </Box>

                {/* Lista de Pedidos */}
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ color: '#1DB954' }}>
                            Minhas Solicitações ({requests.length})
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : requests.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Nenhuma solicitação encontrada
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Você ainda não criou nenhuma solicitação de manutenção.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setIsCreateDialogOpen(true)}
                                sx={{ 
                                    bgcolor: '#1DB954',
                                    '&:hover': { bgcolor: '#18a34b' }
                                }}
                            >
                                Criar Primeira Solicitação
                            </Button>
                        </Box>
                    ) : (
                        <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
                            <Table stickyHeader sx={{ minWidth: 700 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: 150, fontWeight: 'bold' }}>Equipamento</TableCell>
                                        <TableCell sx={{ minWidth: 200, fontWeight: 'bold' }}>Descrição</TableCell>
                                        <TableCell sx={{ minWidth: 120, fontWeight: 'bold' }}>Departamento</TableCell>
                                        <TableCell align="center" sx={{ minWidth: 100, fontWeight: 'bold' }}>Prioridade</TableCell>
                                        <TableCell align="center" sx={{ minWidth: 120, fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ minWidth: 100, fontWeight: 'bold' }}>Data</TableCell>
                                        <TableCell align="right" sx={{ minWidth: 80, fontWeight: 'bold' }}>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((request) => (
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
                                                    maxWidth: 250,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {request.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{request.department}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={request.priority}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${getPriorityColor(request.priority)}22`,
                                                        color: getPriorityColor(request.priority),
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
                                                        backgroundColor: `${getStatusColor(request.status)}22`,
                                                        color: getStatusColor(request.status),
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
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                {/* Dialog para Criar Nova Solicitação */}
                <Dialog
                    open={isCreateDialogOpen}
                    onClose={() => setIsCreateDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ backgroundColor: '#1DB954', color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AddIcon />
                            Nova Solicitação de Manutenção
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Departamento</InputLabel>
                                    <Select
                                        value={newRequest.department}
                                        label="Departamento"
                                        onChange={(e) => setNewRequest(prev => ({ 
                                            ...prev, 
                                            department: e.target.value,
                                            equipment: '' // Reset equipment when department changes
                                        }))}
                                    >
                                        {departments.map((dept) => (
                                            <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required disabled={!newRequest.department}>
                                    <InputLabel>Equipamento</InputLabel>
                                    <Select
                                        value={newRequest.equipment}
                                        label="Equipamento"
                                        onChange={(e) => setNewRequest(prev => ({ ...prev, equipment: e.target.value }))}
                                    >
                                        {getEquipmentOptions().map((equipment) => (
                                            <MenuItem key={equipment} value={equipment}>{equipment}</MenuItem>
                                        ))}
                                        <MenuItem value="Outro">
                                            <em>Outro (especificar na descrição)</em>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Prioridade</InputLabel>
                                    <Select
                                        value={newRequest.priority}
                                        label="Prioridade"
                                        onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value as any }))}
                                    >
                                        {priorities.map((priority) => (
                                            <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descrição do Problema"
                                    value={newRequest.description}
                                    onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                                    multiline
                                    rows={4}
                                    placeholder="Descreva detalhadamente o problema encontrado no equipamento..."
                                    required
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsCreateDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={handleCreateRequest}
                            disabled={!newRequest.equipment || !newRequest.description || !newRequest.department || submitting}
                            sx={{ bgcolor: '#1DB954', '&:hover': { bgcolor: '#18a34b' } }}
                        >
                            {submitting ? 'Criando...' : 'Criar Solicitação'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog para Ver Detalhes */}
                <Dialog
                    open={isViewDialogOpen}
                    onClose={() => setIsViewDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ backgroundColor: '#1DB954', color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VisibilityIcon />
                            Detalhes da Solicitação
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
                                            backgroundColor: `${getStatusColor(selectedRequest.status)}22`,
                                            color: getStatusColor(selectedRequest.status),
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
                                            backgroundColor: `${getPriorityColor(selectedRequest.priority)}22`,
                                            color: getPriorityColor(selectedRequest.priority),
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
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        ID da Solicitação
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {selectedRequest.id.slice(0, 8).toUpperCase()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsViewDialogOpen(false)}>
                            Fechar
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

export default EmployeeMaintenanceRequests; 