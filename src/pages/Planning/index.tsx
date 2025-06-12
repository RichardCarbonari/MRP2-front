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

// Interface para CPU personalizada
interface CustomCPU {
    id: string;
    name: string;
    type: string;
    price: number;
    specs: {
        processor: string;
        motherboard: string;
        ram: string;
        storage: string;
        gpu?: string;
        powerSupply: string;
        case: string;
    };
    status: 'active' | 'inactive';
    createdAt: string;
}

export default function Planning() {
    const [orders, setOrders] = useState<CPUOrder[]>([]);
    const [cpuTypes, setCpuTypes] = useState<Record<string, CPUType>>({});
    const [customCPUs, setCustomCPUs] = useState<CustomCPU[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<CPUOrder | null>(null);
    const [selectedCpuType, setSelectedCpuType] = useState<string>('');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; order: CPUOrder | null }>({
        open: false,
        order: null
    });
    
    // Estados para gerenciar CPUs
    const [openCpuDialog, setOpenCpuDialog] = useState(false);
    const [selectedCpu, setSelectedCpu] = useState<CustomCPU | null>(null);
    const [deleteCpuDialog, setDeleteCpuDialog] = useState<{ open: boolean; cpu: CustomCPU | null }>({
        open: false,
        cpu: null
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
                
                // Converter CPUs do backend para o formato CustomCPU
                const existingCPUs: CustomCPU[] = Object.entries(cpuTypesData).map(([key, cpu]) => ({
                    id: key,
                    name: cpu.name,
                    type: key,
                    price: cpu.price,
                    specs: {
                        processor: cpu.specs.processor,
                        motherboard: cpu.specs.motherboard,
                        ram: cpu.specs.ram,
                        storage: cpu.specs.storage,
                        gpu: cpu.specs.gpu || '',
                        powerSupply: cpu.specs.powerSupply,
                        case: cpu.specs.case
                    },
                    status: 'active' as const,
                    createdAt: new Date().toISOString()
                }));

                setCustomCPUs(existingCPUs);
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
                console.log('Deletando pedido:', deleteDialog.order.id);
                await ordersService.deleteOrder(deleteDialog.order.id);
                console.log('Pedido deletado com sucesso');
                setOrders(prevOrders => prevOrders.filter(order => order.id !== deleteDialog.order!.id));
                setDeleteDialog({ open: false, order: null });
            } catch (error: any) {
                console.error('Erro ao deletar pedido:', error);
                console.error('Detalhes do erro:', error.response?.data);
                setError(`Erro ao deletar pedido: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`);
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
            priority: formData.get('priority') as 'high' | 'medium' | 'low',
            notes: formData.get('notes') as string,
        };

        console.log('Salvando pedido:', { selectedOrder: selectedOrder?.id, orderData });

        try {
            if (selectedOrder) {
                // Editar pedido existente
                console.log('Atualizando pedido existente:', selectedOrder.id);
                const updatedOrder = await ordersService.updateOrder(selectedOrder.id, orderData);
                console.log('Pedido atualizado com sucesso:', updatedOrder);
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === selectedOrder.id ? updatedOrder : order
                    )
                );
            } else {
                // Criar novo pedido
                console.log('Criando novo pedido');
                const newOrder = await ordersService.createOrder(orderData);
                console.log('Pedido criado com sucesso:', newOrder);
                setOrders(prevOrders => [...prevOrders, newOrder]);
            }
            setOpenDialog(false);
            setSelectedOrder(null);
            setSelectedCpuType('');
        } catch (error: any) {
            console.error('Erro ao salvar pedido:', error);
            console.error('Detalhes do erro:', error.response?.data);
            setError(`Erro ao salvar pedido: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`);
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

    // Funções para gerenciar CPUs
    const handleAddCpu = () => {
        setSelectedCpu(null);
        setOpenCpuDialog(true);
    };

    const handleEditCpu = (cpu: CustomCPU) => {
        setSelectedCpu(cpu);
        setOpenCpuDialog(true);
    };

    const handleDeleteCpuClick = (cpu: CustomCPU) => {
        setDeleteCpuDialog({ open: true, cpu });
    };

    const handleDeleteCpuConfirm = async () => {
        if (deleteCpuDialog.cpu) {
            try {
                setCustomCPUs(prevCpus => prevCpus.filter(cpu => cpu.id !== deleteCpuDialog.cpu!.id));
                setDeleteCpuDialog({ open: false, cpu: null });
            } catch (error: any) {
                console.error('Erro ao deletar CPU:', error);
                setError(`Erro ao deletar CPU: ${error.message || 'Erro desconhecido'}`);
            }
        }
    };

    const handleDeleteCpuCancel = () => {
        setDeleteCpuDialog({ open: false, cpu: null });
    };

    const handleCpuSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const cpuData: CustomCPU = {
            id: selectedCpu?.id || `cpu-${Date.now()}`,
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            price: parseFloat(formData.get('price') as string),
            specs: {
                processor: formData.get('processor') as string,
                motherboard: formData.get('motherboard') as string,
                ram: formData.get('ram') as string,
                storage: formData.get('storage') as string,
                gpu: formData.get('gpu') as string,
                powerSupply: formData.get('powerSupply') as string,
                case: formData.get('case') as string,
            },
            status: (formData.get('status') as 'active' | 'inactive') || 'active',
            createdAt: selectedCpu?.createdAt || new Date().toISOString()
        };

        try {
            if (selectedCpu) {
                // Editar CPU existente
                setCustomCPUs(prevCpus => 
                    prevCpus.map(cpu => cpu.id === selectedCpu.id ? cpuData : cpu)
                );
            } else {
                // Adicionar nova CPU
                setCustomCPUs(prevCpus => [...prevCpus, cpuData]);
            }
            setOpenCpuDialog(false);
        } catch (error: any) {
            console.error('Erro ao salvar CPU:', error);
            setError(`Erro ao salvar CPU: ${error.message || 'Erro desconhecido'}`);
        }
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
                                    InputProps={{
                                        inputProps: { min: 1, step: 1 }
                                    }}
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

            {/* Tabela de CPUs Disponíveis */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: 1 }}>
                        🖥️ Gerenciar CPUs
                        <Chip 
                            label={`${Object.keys(cpuTypes).length} produtos`} 
                            size="small" 
                            sx={{ ml: 2, backgroundColor: '#e8f5e8', color: '#2E7D32' }}
                        />
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddCpu}
                        sx={{ 
                            backgroundColor: '#2E7D32',
                            '&:hover': { backgroundColor: '#18a449' },
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Adicionar CPU
                    </Button>
                </Box>

                <TableContainer sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Produto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Categoria</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Preço</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Especificações</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Stock</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(cpuTypes).map(([id, cpu]) => (
                                <TableRow 
                                    key={id} 
                                    sx={{ 
                                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                                        '&:hover': { 
                                            backgroundColor: '#e8f5e8',
                                            transition: 'background-color 0.2s'
                                        }
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 40, 
                                                height: 40, 
                                                borderRadius: 2, 
                                                backgroundColor: '#e8f5e8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <ComputerIcon sx={{ color: '#2E7D32' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                    {cpu.name}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    ID: {id.slice(0, 8)}...
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label="CPU Desktop"
                                            size="small"
                                            sx={{ 
                                                backgroundColor: '#e3f2fd',
                                                color: '#1976d2',
                                                fontWeight: 'medium'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                            {formatCurrency(cpu.price)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ maxWidth: 300 }}>
                                            {cpu.specs && (
                                                <Box>
                                                    {cpu.specs.cores && (
                                                        <Typography variant="caption" sx={{ display: 'block' }}>
                                                            🔧 {cpu.specs.cores} cores / {cpu.specs.threads} threads
                                                        </Typography>
                                                    )}
                                                    {cpu.specs.baseClock && (
                                                        <Typography variant="caption" sx={{ display: 'block' }}>
                                                            ⚡ Base: {cpu.specs.baseClock} | Boost: {cpu.specs.boostClock}
                                                        </Typography>
                                                    )}
                                                    {cpu.specs.socket && (
                                                        <Typography variant="caption" sx={{ display: 'block' }}>
                                                            🔌 Socket: {cpu.specs.socket} | TDP: {cpu.specs.tdp}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label="Em estoque"
                                            size="small"
                                            color="success"
                                            sx={{ fontWeight: 'medium' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label="Ativo"
                                            size="small"
                                            color="success"
                                            sx={{ fontWeight: 'medium' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                            <IconButton
                                                size="small"
                                                sx={{ 
                                                    color: '#2E7D32',
                                                    '&:hover': { backgroundColor: '#e8f5e8' }
                                                }}
                                                title="Visualizar detalhes"
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditCpu({
                                                    id,
                                                    name: cpu.name,
                                                    type: 'CPU',
                                                    price: cpu.price,
                                                    specs: cpu.specs as any,
                                                    status: 'active',
                                                    createdAt: new Date().toISOString()
                                                })}
                                                sx={{ 
                                                    color: '#1976d2',
                                                    '&:hover': { backgroundColor: '#e3f2fd' }
                                                }}
                                                title="Editar CPU"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteCpuClick({
                                                    id,
                                                    name: cpu.name,
                                                    type: 'CPU',
                                                    price: cpu.price,
                                                    specs: cpu.specs as any,
                                                    status: 'active',
                                                    createdAt: new Date().toISOString()
                                                })}
                                                sx={{ 
                                                    color: '#d32f2f',
                                                    '&:hover': { backgroundColor: '#ffebee' }
                                                }}
                                                title="Remover CPU"
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

                {Object.keys(cpuTypes).length === 0 && (
                    <Box sx={{ 
                        textAlign: 'center', 
                        py: 6,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '2px dashed #e0e0e0'
                    }}>
                        <ComputerIcon sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                            Nenhuma CPU cadastrada
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            Adicione CPUs ao catálogo para começar a criar pedidos
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddCpu}
                            sx={{ 
                                backgroundColor: '#2E7D32',
                                '&:hover': { backgroundColor: '#18a449' }
                            }}
                        >
                            Adicionar Primeira CPU
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Dialog para CPU */}
            <Dialog 
                open={openCpuDialog} 
                onClose={() => setOpenCpuDialog(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderTop: '4px solid #2E7D32',
                        borderRadius: 2
                    }
                }}
            >
                <form onSubmit={handleCpuSubmit}>
                    <DialogTitle sx={{ 
                        color: '#2E7D32', 
                        display: 'flex', 
                        alignItems: 'center',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        <ComputerIcon sx={{ mr: 1 }} />
                        {selectedCpu ? 'Editar Produto CPU' : 'Adicionar Nova CPU ao Catálogo'}
                    </DialogTitle>
                    <DialogContent sx={{ p: 4 }}>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            {/* Informações Básicas */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32', display: 'flex', alignItems: 'center' }}>
                                    📋 Informações Básicas
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    label="Nome do Produto"
                                    name="name"
                                    defaultValue={selectedCpu?.name}
                                    required
                                    placeholder="Ex: Intel Core i9-13900K"
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Preço (R$)"
                                    name="price"
                                    type="number"
                                    defaultValue={selectedCpu?.price}
                                    required
                                    InputProps={{
                                        startAdornment: 'R$ ',
                                        inputProps: { min: 0, step: 0.01 }
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            
                            {/* Especificações Técnicas */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32', display: 'flex', alignItems: 'center' }}>
                                    🔧 Especificações Técnicas
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Cores"
                                    name="cores"
                                    defaultValue={selectedCpu?.specs?.cores || ''}
                                    placeholder="Ex: 24"
                                    type="number"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Threads"
                                    name="threads"
                                    defaultValue={selectedCpu?.specs?.threads || ''}
                                    placeholder="Ex: 32"
                                    type="number"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Clock Base"
                                    name="baseClock"
                                    defaultValue={selectedCpu?.specs?.baseClock || ''}
                                    placeholder="Ex: 3.0 GHz"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Clock Boost"
                                    name="boostClock"
                                    defaultValue={selectedCpu?.specs?.boostClock || ''}
                                    placeholder="Ex: 5.8 GHz"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Socket"
                                    name="socket"
                                    defaultValue={selectedCpu?.specs?.socket || ''}
                                    placeholder="Ex: LGA1700"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="TDP"
                                    name="tdp"
                                    defaultValue={selectedCpu?.specs?.tdp || ''}
                                    placeholder="Ex: 125W"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Cache L3"
                                    name="cache"
                                    defaultValue={selectedCpu?.specs?.cache || ''}
                                    placeholder="Ex: 36 MB"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Arquitetura"
                                    name="architecture"
                                    defaultValue={selectedCpu?.specs?.architecture || ''}
                                    placeholder="Ex: Raptor Lake"
                                />
                            </Grid>
                            
                            {/* Compatibilidade */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32', display: 'flex', alignItems: 'center' }}>
                                    🔌 Compatibilidade
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Memória Suportada"
                                    name="memorySupport"
                                    defaultValue={selectedCpu?.specs?.memorySupport || ''}
                                    placeholder="Ex: DDR4-3200, DDR5-5600"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Gráficos Integrados"
                                    name="integratedGraphics"
                                    defaultValue={selectedCpu?.specs?.integratedGraphics || ''}
                                    placeholder="Ex: Intel UHD Graphics 770"
                                />
                            </Grid>
                            
                            {/* Status e Categoria */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32', display: 'flex', alignItems: 'center' }}>
                                    ⚙️ Configurações
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        defaultValue={selectedCpu?.status || 'active'}
                                        label="Status"
                                        name="status"
                                    >
                                        <MenuItem value="active">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4caf50' }} />
                                                Ativo
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="inactive">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f44336' }} />
                                                Inativo
                                            </Box>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Categoria</InputLabel>
                                    <Select
                                        defaultValue="desktop"
                                        label="Categoria"
                                        name="category"
                                    >
                                        <MenuItem value="desktop">CPU Desktop</MenuItem>
                                        <MenuItem value="server">CPU Servidor</MenuItem>
                                        <MenuItem value="mobile">CPU Mobile</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
                        <Button 
                            onClick={() => setOpenCpuDialog(false)} 
                            type="button"
                            sx={{ 
                                color: '#666',
                                '&:hover': { backgroundColor: '#f0f0f0' }
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ 
                                backgroundColor: '#2E7D32',
                                '&:hover': { backgroundColor: '#18a449' },
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                px: 3
                            }}
                        >
                            {selectedCpu ? '💾 Salvar Alterações' : '➕ Adicionar CPU'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dialog de confirmação de delete CPU */}
            <Dialog
                open={deleteCpuDialog.open}
                onClose={handleDeleteCpuCancel}
                PaperProps={{
                    sx: {
                        borderTop: '4px solid #D32F2F'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#D32F2F', display: 'flex', alignItems: 'center' }}>
                    <DeleteIcon sx={{ mr: 1 }} />
                    Confirmar Exclusão da CPU
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Tem certeza que deseja excluir a CPU:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1, color: '#D32F2F' }}>
                        {deleteCpuDialog.cpu?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Esta ação não pode ser desfeita.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCpuCancel}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDeleteCpuConfirm}
                        variant="contained" 
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Excluir
                    </Button>
                </DialogActions>
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
