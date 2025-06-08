import React, { useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ComputerIcon from '@mui/icons-material/Computer';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ptBR from 'date-fns/locale/pt-BR';

interface CPUOrder {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    cpuType: string;
    cpuSpecs: {
        processor: string;
        motherboard: string;
        ram: string;
        storage: string;
        gpu?: string;
        powerSupply: string;
        case: string;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    orderDate: Date;
    deliveryDate: Date;
    status: 'pending' | 'assembly' | 'testing' | 'ready' | 'delivered';
    priority: 'high' | 'medium' | 'low';
    notes: string;
}

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
    const [orders, setOrders] = useState<CPUOrder[]>([
        {
            id: 'PED001',
            customerName: 'João Silva',
            customerEmail: 'joao.silva@email.com',
            customerPhone: '(11) 99999-9999',
            cpuType: 'gaming-basic',
            cpuSpecs: cpuTypes['gaming-basic'].specs,
            quantity: 2,
            unitPrice: cpuTypes['gaming-basic'].price,
            totalPrice: cpuTypes['gaming-basic'].price * 2,
            orderDate: new Date('2024-12-20'),
            deliveryDate: new Date('2024-12-27'),
            status: 'assembly',
            priority: 'high',
            notes: 'Cliente solicitou montagem expressa'
        },
        {
            id: 'PED002',
            customerName: 'Maria Santos',
            customerEmail: 'maria.santos@empresa.com',
            customerPhone: '(11) 88888-8888',
            cpuType: 'workstation',
            cpuSpecs: cpuTypes['workstation'].specs,
            quantity: 1,
            unitPrice: cpuTypes['workstation'].price,
            totalPrice: cpuTypes['workstation'].price,
            orderDate: new Date('2024-12-21'),
            deliveryDate: new Date('2024-12-30'),
            status: 'pending',
            priority: 'medium',
            notes: 'Para uso em arquitetura e renderização'
        },
        {
            id: 'PED003',
            customerName: 'Pedro Costa',
            customerEmail: 'pedro.costa@email.com',
            customerPhone: '(11) 77777-7777',
            cpuType: 'gaming-advanced',
            cpuSpecs: cpuTypes['gaming-advanced'].specs,
            quantity: 1,
            unitPrice: cpuTypes['gaming-advanced'].price,
            totalPrice: cpuTypes['gaming-advanced'].price,
            orderDate: new Date('2024-12-19'),
            deliveryDate: new Date('2024-12-26'),
            status: 'testing',
            priority: 'high',
            notes: 'Configuração personalizada com overclock'
        }
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<CPUOrder | null>(null);
    const [selectedCpuType, setSelectedCpuType] = useState<string>('');

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

    const getStatusColor = (status: CPUOrder['status']) => {
        switch (status) {
            case 'pending':
                return '#ff9800';
            case 'assembly':
                return '#2196f3';
            case 'testing':
                return '#9c27b0';
            case 'ready':
                return '#4caf50';
            case 'delivered':
                return '#666';
            default:
                return '#666';
        }
    };

    const getStatusText = (status: CPUOrder['status']) => {
        switch (status) {
            case 'pending':
                return 'Pendente';
            case 'assembly':
                return 'Montagem';
            case 'testing':
                return 'Testes';
            case 'ready':
                return 'Pronto';
            case 'delivered':
                return 'Entregue';
            default:
                return status;
        }
    };

    const getPriorityColor = (priority: CPUOrder['priority']) => {
        switch (priority) {
            case 'high':
                return '#f44336';
            case 'medium':
                return '#ff9800';
            case 'low':
                return '#4caf50';
            default:
                return '#666';
        }
    };

    const getPriorityText = (priority: CPUOrder['priority']) => {
        switch (priority) {
            case 'high':
                return 'Alta';
            case 'medium':
                return 'Média';
            case 'low':
                return 'Baixa';
            default:
                return priority;
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

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                    🖥️ Pedidos de CPUs Completas
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 3 }}>
                    Gerenciamento de pedidos de computadores montados e testados
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={2.4}>
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
                    <Grid item xs={12} md={2.4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Em Montagem
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#2196f3' }}>
                                    {orders.filter(o => o.status === 'assembly').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={2.4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Em Testes
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#9c27b0' }}>
                                    {orders.filter(o => o.status === 'testing').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={2.4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Prontos
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#4caf50' }}>
                                    {orders.filter(o => o.status === 'ready').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={2.4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Entregues
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#666' }}>
                                    {orders.filter(o => o.status === 'delivered').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                        📋 Lista de Pedidos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddOrder}
                        sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#18a449' } }}
                    >
                        Novo Pedido
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Tipo de CPU</TableCell>
                                <TableCell align="right">Qtd</TableCell>
                                <TableCell align="right">Valor Total</TableCell>
                                <TableCell>Data Entrega</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Prioridade</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                {order.customerName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {order.customerEmail}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ComputerIcon fontSize="small" sx={{ color: '#2E7D32' }} />
                                            {cpuTypes[order.cpuType as keyof typeof cpuTypes]?.name || order.cpuType}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">{order.quantity}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                        {formatCurrency(order.totalPrice)}
                                    </TableCell>
                                    <TableCell>{order.deliveryDate.toLocaleDateString('pt-BR')}</TableCell>
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
                                    <TableCell align="right">
                                        <IconButton size="small" sx={{ color: '#2E7D32' }}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEditOrder(order)}
                                            sx={{ color: '#2E7D32' }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Dialog para adicionar/editar pedido */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
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
                                defaultValue={selectedOrder?.customerName}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                defaultValue={selectedOrder?.customerEmail}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Telefone"
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
                            <FormControl fullWidth>
                                <InputLabel>Tipo de CPU</InputLabel>
                                <Select
                                    value={selectedCpuType}
                                    label="Tipo de CPU"
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
                                type="number"
                                defaultValue={selectedOrder?.quantity || 1}
                                required
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Preço Unitário"
                                value={selectedCpuType ? formatCurrency(cpuTypes[selectedCpuType as keyof typeof cpuTypes]?.price || 0) : ''}
                                disabled
                            />
                        </Grid>

                        {/* Especificações detalhadas */}
                        {selectedCpuType && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        📋 Componentes Inclusos:
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {Object.entries(cpuTypes[selectedCpuType as keyof typeof cpuTypes].specs).map(([component, spec]) => (
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
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                                <DatePicker
                                    label="Data de Entrega"
                                    defaultValue={selectedOrder?.deliveryDate}
                                    sx={{ width: '100%' }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Prioridade</InputLabel>
                                <Select
                                    defaultValue={selectedOrder?.priority || 'medium'}
                                    label="Prioridade"
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
                                multiline
                                rows={3}
                                defaultValue={selectedOrder?.notes}
                                placeholder="Observações especiais, customizações, etc."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ 
                            backgroundColor: '#2E7D32',
                            '&:hover': { backgroundColor: '#18a449' }
                        }}
                    >
                        {selectedOrder ? 'Salvar' : 'Criar Pedido'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 
