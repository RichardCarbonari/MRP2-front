import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ComputerIcon from '@mui/icons-material/Computer';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ptBR from 'date-fns/locale/pt-BR';
import { ordersService, CPUOrder, CPUType } from '../../services/api';

// Tipos de CPU pré-definidos
const cpuTypes = {
    'gaming-basic': {
        name: 'Gaming Básico',
        price: 2500,
        specs: {
            processor: 'Intel Core i5-13400F',
            motherboard: 'ASUS TUF B660M-PLUS WiFi D4',
            ram: 'Corsair Vengeance LPX 16GB DDR4',
            storage: 'Kingston NV2 1TB NVMe',
            gpu: 'NVIDIA GeForce RTX 3060 12GB',
            powerSupply: 'Corsair CV550 550W 80 Plus Bronze',
            case: 'Cooler Master Q300L'
        }
    },
    'gaming-advanced': {
        name: 'Gaming Avançado',
        price: 4200,
        specs: {
            processor: 'Intel Core i7-13700F',
            motherboard: 'ASUS ROG STRIX B660-F GAMING WiFi',
            ram: 'Corsair Vengeance LPX 32GB DDR4',
            storage: 'Samsung 980 PRO 2TB NVMe',
            gpu: 'NVIDIA GeForce RTX 4070 Ti',
            powerSupply: 'Corsair RM750x 750W 80 Plus Gold',
            case: 'NZXT H5 Flow'
        }
    },
    'workstation': {
        name: 'Workstation',
        price: 3800,
        specs: {
            processor: 'Intel Core i7-13700',
            motherboard: 'ASUS ProArt B660-CREATOR D4',
            ram: 'Corsair Vengeance LPX 64GB DDR4',
            storage: 'Samsung 980 PRO 1TB NVMe',
            gpu: 'NVIDIA RTX A4000',
            powerSupply: 'Corsair RM850x 850W 80 Plus Gold',
            case: 'Fractal Design Define 7'
        }
    },
    'office': {
        name: 'Office/Corporativo',
        price: 1800,
        specs: {
            processor: 'Intel Core i5-13400',
            motherboard: 'ASUS PRIME B660M-A D4',
            ram: 'Corsair Vengeance LPX 16GB DDR4',
            storage: 'Kingston NV2 512GB NVMe',
            powerSupply: 'Corsair CV450 450W 80 Plus Bronze',
            case: 'Cooler Master MasterBox Q300L'
        }
    },
    'budget': {
        name: 'Entrada/Budget',
        price: 1200,
        specs: {
            processor: 'Intel Core i3-13100',
            motherboard: 'ASUS PRIME H610M-E D4',
            ram: 'Kingston FURY Beast 8GB DDR4',
            storage: 'Kingston NV2 256GB NVMe',
            powerSupply: 'Corsair CV350 350W',
            case: 'Cooler Master MasterBox Q300L'
        }
    }
};

export default function Planning() {
    const [orders, setOrders] = useState<CPUOrder[]>([]);
    const [cpuTypes, setCpuTypes] = useState<Record<string, CPUType>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<CPUOrder | null>(null);
    const [selectedCpuType, setSelectedCpuType] = useState<string>('');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; order: CPUOrder | null }>({
        open: false,
        order: null
    });

    // Carregar dados do backend
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [ordersData, cpuTypesData] = await Promise.all([
                    ordersService.getOrders(),
                    ordersService.getCPUTypes()
                ]);
                setOrders(ordersData);
                setCpuTypes(cpuTypesData);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError('Erro ao carregar dados dos pedidos');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleAddOrder = () => {
        setSelectedOrder(null);
        setSelectedCpuType('');
        setOpenDialog(true);
    };

    const handleEditOrder = (order: CPUOrder) => {
        setSelectedOrder(order);
        setSelectedCpuType(order.cpuType);
        setOpenDialog(true);
    };

    const handleDeleteClick = (order: CPUOrder) => {
        setDeleteDialog({ open: true, order });
    };

    const handleDeleteConfirm = async () => {
        if (deleteDialog.order) {
            try {
                await ordersService.deleteOrder(deleteDialog.order.id);
                setOrders(prevOrders => prevOrders.filter(order => order.id !== deleteDialog.order!.id));
                setDeleteDialog({ open: false, order: null });
            } catch (error) {
                console.error('Erro ao deletar pedido:', error);
                setError('Erro ao deletar pedido');
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, order: null });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const orderData = {
            customerName: formData.get('customerName') as string,
            customerEmail: formData.get('customerEmail') as string,
            customerPhone: formData.get('customerPhone') as string,
            cpuType: formData.get('cpuType') as string,
            quantity: parseInt(formData.get('quantity') as string),
            deliveryDate: formData.get('deliveryDate') as string,
            priority: formData.get('priority') as string,
            notes: formData.get('notes') as string,
        };

        try {
            if (selectedOrder) {
                // Editar pedido existente
                const updatedOrder = await ordersService.updateOrder(selectedOrder.id, orderData);
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === selectedOrder.id ? updatedOrder : order
                    )
                );
            } else {
                // Criar novo pedido
                const newOrder = await ordersService.createOrder(orderData);
                setOrders(prevOrders => [...prevOrders, newOrder]);
            }
            setOpenDialog(false);
            setSelectedOrder(null);
            setSelectedCpuType('');
        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
            setError('Erro ao salvar pedido');
        }
    };

    const getStatusColor = (status: CPUOrder['status']) => {
        switch (status) {
            case 'pending': return '#ff9800';
            case 'assembly': return '#2196f3';
            case 'testing': return '#9c27b0';
            case 'ready': return '#4caf50';
            case 'delivered': return '#2E7D32';
            default: return '#757575';
        }
    };

    const getStatusText = (status: CPUOrder['status']) => {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'assembly': return 'Montando';
            case 'testing': return 'Testando';
            case 'ready': return 'Pronto';
            case 'delivered': return 'Entregue';
            default: return status;
        }
    };

    const getPriorityColor = (priority: CPUOrder['priority']) => {
        switch (priority) {
            case 'high': return '#f44336';
            case 'medium': return '#ff9800';
            case 'low': return '#4caf50';
            default: return '#757575';
        }
    };

    const getPriorityText = (priority: CPUOrder['priority']) => {
        switch (priority) {
            case 'high': return 'Alta';
            case 'medium': return 'Média';
            case 'low': return 'Baixa';
            default: return priority;
        }
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const handleCpuTypeChange = (cpuType: string) => {
        setSelectedCpuType(cpuType);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ color: '#2E7D32', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                        Carregando pedidos...
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                🖥️ Pedidos de CPUs Completas
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Gerenciamento de pedidos de computadores montados e testados
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Estatísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total de Pedidos
                            </Typography>
                            <Typography variant="h4">
                                {orders.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Pendentes
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#ff9800' }}>
                                {orders.filter(o => o.status === 'pending').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Em Produção
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#2196f3' }}>
                                {orders.filter(o => o.status === 'assembly' || o.status === 'testing').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Entregues
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#2E7D32' }}>
                                {orders.filter(o => o.status === 'delivered').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Lista de Pedidos */}
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                        📋 Lista de Pedidos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddOrder}
                        sx={{ 
                            backgroundColor: '#2E7D32',
                            '&:hover': { backgroundColor: '#1B5E20' }
                        }}
                    >
                        Novo Pedido
                    </Button>
                </Box>

                <TableContainer sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Cliente</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Tipo de CPU</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Qtd</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Valor Total</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Prioridade</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Entrega</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow 
                                    key={order.id}
                                    sx={{ 
                                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                                        '&:hover': { 
                                            backgroundColor: '#e8f5e8',
                                            transition: 'background-color 0.2s'
                                        }
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>{order.id}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            {order.customerName}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {order.customerEmail}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {cpuTypes[order.cpuType]?.name || order.cpuType}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {order.quantity}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                            {formatCurrency(order.totalPrice)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStatusText(order.status)}
                                            sx={{
                                                backgroundColor: `${getStatusColor(order.status)}15`,
                                                color: getStatusColor(order.status),
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getPriorityText(order.priority)}
                                            sx={{
                                                backgroundColor: `${getPriorityColor(order.priority)}15`,
                                                color: getPriorityColor(order.priority),
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="textSecondary">
                                            {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton size="small" sx={{ color: '#2E7D32' }}>
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditOrder(order)}
                                                sx={{ color: '#2E7D32' }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDeleteClick(order)}
                                                sx={{ color: '#D32F2F' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Dialog para adicionar/editar pedido */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle sx={{ backgroundColor: '#2E7D32', color: 'white' }}>
                        {selectedOrder ? 'Editar Pedido' : 'Novo Pedido de CPU'}
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                            {/* Dados do Cliente */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32' }}>
                                    👤 Dados do Cliente
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nome do Cliente"
                                    name="customerName"
                                    defaultValue={selectedOrder?.customerName}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="customerEmail"
                                    type="email"
                                    defaultValue={selectedOrder?.customerEmail}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Telefone"
                                    name="customerPhone"
                                    defaultValue={selectedOrder?.customerPhone}
                                    required
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32' }}>
                                    🖥️ Especificações da CPU
                                </Typography>
                            </Grid>
                            
                            {/* Tipo de CPU */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Tipo de CPU</InputLabel>
                                    <Select
                                        value={selectedCpuType}
                                        label="Tipo de CPU"
                                        name="cpuType"
                                        onChange={(e) => handleCpuTypeChange(e.target.value)}
                                    >
                                        {Object.entries(cpuTypes).map(([key, cpu]) => (
                                            <MenuItem key={key} value={key}>
                                                {cpu.name} - {formatCurrency(cpu.price)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Quantidade"
                                    name="quantity"
                                    type="number"
                                    defaultValue={selectedOrder?.quantity || 1}
                                    required
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Preço Unitário"
                                    value={selectedCpuType ? formatCurrency(cpuTypes[selectedCpuType]?.price || 0) : ''}
                                    disabled
                                />
                            </Grid>

                            {/* Especificações detalhadas */}
                            {selectedCpuType && cpuTypes[selectedCpuType] && (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            📋 Componentes Inclusos:
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {Object.entries(cpuTypes[selectedCpuType].specs).map(([component, spec]) => (
                                                <Grid item xs={12} md={6} key={component}>
                                                    <Typography variant="body2">
                                                        <strong>{component.charAt(0).toUpperCase() + component.slice(1)}:</strong> {spec}
                                                    </Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Paper>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32' }}>
                                    📅 Detalhes do Pedido
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Data de Entrega"
                                    name="deliveryDate"
                                    type="date"
                                    defaultValue={selectedOrder?.deliveryDate ? selectedOrder.deliveryDate.split('T')[0] : ''}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Prioridade</InputLabel>
                                    <Select
                                        defaultValue={selectedOrder?.priority || 'medium'}
                                        label="Prioridade"
                                        name="priority"
                                    >
                                        <MenuItem value="low">Baixa</MenuItem>
                                        <MenuItem value="medium">Média</MenuItem>
                                        <MenuItem value="high">Alta</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Observações"
                                    name="notes"
                                    multiline
                                    rows={3}
                                    defaultValue={selectedOrder?.notes}
                                    placeholder="Observações especiais, customizações, etc."
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenDialog(false)} type="button">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ 
                                backgroundColor: '#2E7D32',
                                '&:hover': { backgroundColor: '#18a449' }
                            }}
                        >
                            {selectedOrder ? 'Salvar' : 'Criar Pedido'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dialog de confirmação de delete */}
            <Dialog
                open={deleteDialog.open}
                onClose={handleDeleteCancel}
                PaperProps={{
                    sx: {
                        borderTop: '4px solid #D32F2F'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#D32F2F', display: 'flex', alignItems: 'center' }}>
                    <DeleteIcon sx={{ mr: 1 }} />
                    Confirmar Exclusão do Pedido
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Tem certeza que deseja excluir o pedido:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1, color: '#D32F2F' }}>
                        {deleteDialog.order?.id} - {deleteDialog.order?.customerName}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Esta ação não pode ser desfeita.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm}
                        variant="contained" 
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 
