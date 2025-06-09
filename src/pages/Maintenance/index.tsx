import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Fade,
    Zoom,
    CircularProgress,
    Alert,
    Skeleton,
    LinearProgress,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { ptBR } from 'date-fns/locale';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ConstructionIcon from '@mui/icons-material/Construction';

interface Equipment {
    id: number;
    name: string;
    type: string;
    status: 'operational' | 'maintenance' | 'broken';
    lastMaintenance: Date | string;
    nextMaintenance: Date | string;
    location?: string;
    serialNumber?: string;
    manufacturer?: string;
    model?: string;
}

interface MaintenanceRecord {
    id: number;
    equipmentId: number;
    equipmentName?: string;
    type: 'preventive' | 'corrective';
    description: string;
    date: Date | string;
    technician: string;
    cost: number;
    status: 'scheduled' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    estimatedDuration?: number;
    notes?: string;
    completedAt?: Date | string;
}

interface MaintenanceMetrics {
    totalEquipment: number;
    operationalEquipment: number;
    maintenanceEquipment: number;
    brokenEquipment: number;
    totalMaintenanceRecords: number;
    scheduledMaintenance: number;
    inProgressMaintenance: number;
    completedMaintenance: number;
    totalMaintenanceCosts: number;
    averageMaintenanceCost: number;
    equipmentUptime: number;
}

export default function Maintenance() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
    const [metrics, setMetrics] = useState<MaintenanceMetrics | null>(null);

    const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);
    const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRecord | null>(null);
    const [newEquipment, setNewEquipment] = useState<Omit<Equipment, 'id'>>({
        name: '',
        type: '',
        status: 'operational',
        lastMaintenance: new Date(),
        nextMaintenance: new Date()
    });
    const [newMaintenance, setNewMaintenance] = useState<Omit<MaintenanceRecord, 'id'>>({
        equipmentId: 0,
        type: 'preventive',
        description: '',
        date: new Date(),
        technician: '',
        cost: 0,
        status: 'scheduled'
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return '#1DB954';
            case 'maintenance':
                return '#ffa726';
            case 'broken':
                return '#ff3333';
            default:
                return '#666666';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'operational':
                return 'Operacional';
            case 'maintenance':
                return 'Em Manutenção';
            case 'broken':
                return 'Quebrado';
            default:
                return status;
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const handleAddEquipment = () => {
        setSelectedEquipment(null);
        setIsEquipmentDialogOpen(true);
    };

    const handleEditEquipment = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setIsEquipmentDialogOpen(true);
    };

    const handleAddMaintenance = () => {
        setSelectedMaintenance(null);
        setIsMaintenanceDialogOpen(true);
    };

    const handleEditMaintenance = (maintenance: MaintenanceRecord) => {
        setSelectedMaintenance(maintenance);
        setIsMaintenanceDialogOpen(true);
    };

    // Carregar dados de manutenção do backend
    const loadMaintenanceData = async () => {
        try {
            setError(null);
            
            // Carregar equipamentos, registros e métricas em paralelo
            const [equipmentResponse, recordsResponse, metricsResponse] = await Promise.all([
                fetch('/api/maintenance/equipment'),
                fetch('/api/maintenance/records'),
                fetch('/api/maintenance/metrics')
            ]);

            if (!equipmentResponse.ok || !recordsResponse.ok || !metricsResponse.ok) {
                throw new Error('Erro ao carregar dados de manutenção');
            }

            const equipmentData = await equipmentResponse.json();
            const recordsData = await recordsResponse.json();
            const metricsData = await metricsResponse.json();

            if (equipmentData.success) {
                setEquipment(equipmentData.data);
            }

            if (recordsData.success) {
                setMaintenanceRecords(recordsData.data);
            }

            if (metricsData.success) {
                setMetrics(metricsData.data);
            }

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Carregar dados iniciais
    useEffect(() => {
        loadMaintenanceData();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadMaintenanceData();
    };

    const handleDeleteEquipment = (id: number) => {
        setEquipment(equipment.filter(e => e.id !== id));
    };

    const handleDeleteMaintenance = (id: number) => {
        setMaintenanceRecords(records => records.filter(r => r.id !== id));
    };

    const handleSaveEquipment = () => {
        if (selectedEquipment) {
            // Editar equipamento existente
            setEquipment(equipment.map(e => 
                e.id === selectedEquipment.id 
                    ? { ...selectedEquipment, ...newEquipment }
                    : e
            ));
        } else {
            // Adicionar novo equipamento
            const newId = Math.max(...equipment.map(e => e.id), 0) + 1;
            setEquipment([...equipment, { id: newId, ...newEquipment }]);
        }
        setIsEquipmentDialogOpen(false);
    };

    const handleSaveMaintenance = () => {
        if (selectedMaintenance) {
            // Editar manutenção existente
            setMaintenanceRecords(records => 
                records.map(r => 
                    r.id === selectedMaintenance.id 
                        ? { ...selectedMaintenance, ...newMaintenance }
                        : r
                )
            );
        } else {
            // Adicionar nova manutenção
            const newId = Math.max(...maintenanceRecords.map(r => r.id), 0) + 1;
            setMaintenanceRecords([...maintenanceRecords, { id: newId, ...newMaintenance }]);
        }
        setIsMaintenanceDialogOpen(false);
    };

    return (
        <Fade in={true} timeout={800}>
            <Container maxWidth="xl">
                <Box sx={{ py: 4 }}>
                    {/* Header */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 4,
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                color: '#1DB954', 
                                fontWeight: 'bold',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -8,
                                    left: 0,
                                    width: '60%',
                                    height: 4,
                                    backgroundColor: '#1DB954',
                                    borderRadius: 2
                                }
                            }}
                        >
                            Gestão de Manutenção
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon className={refreshing ? 'rotating' : ''} />}
                                onClick={handleRefresh}
                                sx={{ 
                                    borderColor: '#1DB954',
                                    color: '#1DB954',
                                    '&:hover': {
                                        borderColor: '#18a34b',
                                        backgroundColor: 'rgba(29, 185, 84, 0.1)'
                                    }
                                }}
                            >
                                Atualizar
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddEquipment}
                                sx={{ 
                                    bgcolor: '#1DB954',
                                    '&:hover': {
                                        bgcolor: '#18a34b'
                                    },
                                    boxShadow: '0 4px 6px rgba(29, 185, 84, 0.2)'
                                }}
                            >
                                Novo Equipamento
                            </Button>
                        </Box>
                    </Box>

                    {/* Métricas */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {[
                            {
                                title: 'Total de Equipamentos',
                                value: equipment.length,
                                icon: <ConstructionIcon />,
                                color: '#1DB954'
                            },
                            {
                                title: 'Manutenções Pendentes',
                                value: maintenanceRecords.filter(m => m.status === 'scheduled').length,
                                icon: <BuildIcon />,
                                color: '#ffa726'
                            },
                            {
                                title: 'Equipamentos Operacionais',
                                value: equipment.filter(e => e.status === 'operational').length,
                                icon: <CheckCircleIcon />,
                                color: '#1DB954'
                            },
                            {
                                title: 'Em Manutenção',
                                value: equipment.filter(e => e.status === 'maintenance').length,
                                icon: <EngineeringIcon />,
                                color: '#ffa726'
                            }
                        ].map((metric, index) => (
                            <Grid item xs={12} sm={6} md={3} key={metric.title}>
                                <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                                    <Card sx={{
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Box sx={{ 
                                                    color: metric.color,
                                                    mr: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 1,
                                                    borderRadius: '50%',
                                                    backgroundColor: `${metric.color}22`
                                                }}>
                                                    {metric.icon}
                                                </Box>
                                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                                    {metric.title}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" sx={{ color: metric.color, fontWeight: 'bold' }}>
                                                {metric.value}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Lista de Equipamentos */}
                    <Paper sx={{ 
                        p: 3, 
                        mb: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}>
                        <Typography variant="h6" sx={{ 
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&::before': {
                                content: '""',
                                width: 4,
                                height: 24,
                                backgroundColor: '#1DB954',
                                borderRadius: 2
                            }
                        }}>
                            Equipamentos
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Última Manutenção</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Próxima Manutenção</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {equipment.map((item) => (
                                        <TableRow 
                                            key={item.id}
                                            hover
                                            sx={{
                                                transition: 'background-color 0.2s',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(29, 185, 84, 0.05)'
                                                }
                                            }}
                                        >
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={getStatusLabel(item.status)}
                                                    sx={{
                                                        bgcolor: `${getStatusColor(item.status)}22`,
                                                        color: getStatusColor(item.status),
                                                        fontWeight: 'bold',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(item.lastMaintenance)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(item.nextMaintenance)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton 
                                                    onClick={() => handleEditEquipment(item)}
                                                    sx={{ color: '#1DB954' }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleDeleteEquipment(item.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* Registros de Manutenção */}
                    <Paper sx={{ 
                        p: 3,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <Typography variant="h6" sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                '&::before': {
                                    content: '""',
                                    width: 4,
                                    height: 24,
                                    backgroundColor: '#1DB954',
                                    borderRadius: 2
                                }
                            }}>
                                Registros de Manutenção
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddMaintenance}
                                sx={{ 
                                    bgcolor: '#1DB954',
                                    '&:hover': {
                                        bgcolor: '#18a34b'
                                    },
                                    boxShadow: '0 4px 6px rgba(29, 185, 84, 0.2)'
                                }}
                            >
                                Nova Manutenção
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Equipamento</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Técnico</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Custo</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {maintenanceRecords.map((record) => (
                                        <TableRow 
                                            key={record.id}
                                            hover
                                            sx={{
                                                transition: 'background-color 0.2s',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(29, 185, 84, 0.05)'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                {equipment.find(e => e.id === record.equipmentId)?.name}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={record.type === 'preventive' ? 'Preventiva' : 'Corretiva'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: record.type === 'preventive' ? '#1DB95422' : '#ffa72622',
                                                        color: record.type === 'preventive' ? '#1DB954' : '#ffa726',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{record.description}</TableCell>
                                            <TableCell>{formatDate(record.date)}</TableCell>
                                            <TableCell>{record.technician}</TableCell>
                                            <TableCell align="right">
                                                {record.cost.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={record.status === 'scheduled' ? 'Agendada' : 
                                                           record.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: record.status === 'completed' ? '#1DB95422' : 
                                                                record.status === 'in_progress' ? '#ffa72622' : '#66666622',
                                                        color: record.status === 'completed' ? '#1DB954' : 
                                                               record.status === 'in_progress' ? '#ffa726' : '#666666',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton 
                                                    onClick={() => handleEditMaintenance(record)}
                                                    sx={{ color: '#1DB954' }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleDeleteMaintenance(record.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* Dialogs */}
                    <Dialog
                        open={isEquipmentDialogOpen}
                        onClose={() => setIsEquipmentDialogOpen(false)}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle sx={{ backgroundColor: '#1DB954', color: 'white' }}>
                            {selectedEquipment ? 'Editar Equipamento' : 'Novo Equipamento'}
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nome do Equipamento"
                                        value={selectedEquipment?.name || newEquipment.name}
                                        onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Tipo"
                                        value={selectedEquipment?.type || newEquipment.type}
                                        onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={selectedEquipment?.status || newEquipment.status}
                                            label="Status"
                                            onChange={(e) => setNewEquipment({ ...newEquipment, status: e.target.value as 'operational' | 'maintenance' | 'broken' })}
                                        >
                                            <MenuItem value="operational">Operacional</MenuItem>
                                            <MenuItem value="maintenance">Em Manutenção</MenuItem>
                                            <MenuItem value="broken">Quebrado</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                                        <DatePicker
                                            label="Última Manutenção"
                                            value={selectedEquipment?.lastMaintenance || newEquipment.lastMaintenance}
                                            onChange={(date) => setNewEquipment({ ...newEquipment, lastMaintenance: date || new Date() })}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                                        <DatePicker
                                            label="Próxima Manutenção"
                                            value={selectedEquipment?.nextMaintenance || newEquipment.nextMaintenance}
                                            onChange={(date) => setNewEquipment({ ...newEquipment, nextMaintenance: date || new Date() })}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsEquipmentDialogOpen(false)}>Cancelar</Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveEquipment}
                                sx={{
                                    backgroundColor: '#1DB954',
                                    '&:hover': {
                                        backgroundColor: '#18a449',
                                    },
                                }}
                            >
                                {selectedEquipment ? 'Salvar' : 'Adicionar'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={isMaintenanceDialogOpen}
                        onClose={() => setIsMaintenanceDialogOpen(false)}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle sx={{ backgroundColor: '#1DB954', color: 'white' }}>
                            {selectedMaintenance ? 'Editar Manutenção' : 'Nova Manutenção'}
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Equipamento</InputLabel>
                                        <Select
                                            value={selectedMaintenance?.equipmentId || newMaintenance.equipmentId}
                                            label="Equipamento"
                                            onChange={(e) => setNewMaintenance({ ...newMaintenance, equipmentId: Number(e.target.value) })}
                                        >
                                            {equipment.map((eq) => (
                                                <MenuItem key={eq.id} value={eq.id}>{eq.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Tipo</InputLabel>
                                        <Select
                                            value={selectedMaintenance?.type || newMaintenance.type}
                                            label="Tipo"
                                            onChange={(e) => setNewMaintenance({ ...newMaintenance, type: e.target.value as 'preventive' | 'corrective' })}
                                        >
                                            <MenuItem value="preventive">Preventiva</MenuItem>
                                            <MenuItem value="corrective">Corretiva</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Descrição"
                                        value={selectedMaintenance?.description || newMaintenance.description}
                                        onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
                                        multiline
                                        rows={4}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                                        <DatePicker
                                            label="Data"
                                            value={selectedMaintenance?.date || newMaintenance.date}
                                            onChange={(date) => setNewMaintenance({ ...newMaintenance, date: date || new Date() })}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Técnico Responsável"
                                        value={selectedMaintenance?.technician || newMaintenance.technician}
                                        onChange={(e) => setNewMaintenance({ ...newMaintenance, technician: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Custo"
                                        type="number"
                                        value={selectedMaintenance?.cost || newMaintenance.cost}
                                        onChange={(e) => setNewMaintenance({ ...newMaintenance, cost: Number(e.target.value) })}
                                        required
                                        InputProps={{
                                            startAdornment: 'R$'
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={selectedMaintenance?.status || newMaintenance.status}
                                            label="Status"
                                            onChange={(e) => setNewMaintenance({ ...newMaintenance, status: e.target.value as 'scheduled' | 'in_progress' | 'completed' })}
                                        >
                                            <MenuItem value="scheduled">Agendada</MenuItem>
                                            <MenuItem value="in_progress">Em Andamento</MenuItem>
                                            <MenuItem value="completed">Concluída</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsMaintenanceDialogOpen(false)}>Cancelar</Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveMaintenance}
                                sx={{
                                    backgroundColor: '#1DB954',
                                    '&:hover': {
                                        backgroundColor: '#18a449',
                                    },
                                }}
                            >
                                {selectedMaintenance ? 'Salvar' : 'Adicionar'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <style>{`
                        @keyframes rotate {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        .rotating {
                            animation: rotate 1s linear infinite;
                        }
                    `}</style>
                </Box>
            </Container>
        </Fade>
    );
} 