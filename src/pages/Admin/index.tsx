import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Card,
    CardContent,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { ptBR } from 'date-fns/locale';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TimerComponent from '../../components/TimerComponent';
import { useTimer } from '../../contexts/TimerContext';
import TeamStatusTable from '../../components/TeamStatusTable';
import { teamsConfig } from '../../config/teams';

interface Employee {
    id: number;
    name: string;
    currentTask: string;
    status: string;
    progress: number;
}

interface ProductionOrder {
    id: number;
    product: string;
    quantity: number;
    deadline: string;
    status: string;
    assignedTo: string;
}

interface Admin {
    id: number;
    name: string;
    role: string;
    department: string;
    shift: string;
}

interface TimerConfig {
    defaultTime: number; // em minutos
    isConfiguring: boolean;
}

interface NewProductionOrder {
    product: string;
    quantity: number;
    deadline: Date | null;
    assignedTo: string;
}

export default function Admin() {
    const { estimatedTime, setEstimatedTime } = useTimer();
    const [adminInfo] = useState<Admin>({
        id: 1,
        name: "Carlos Roberto Gomes",
        role: "Gerente de Produção",
        department: "Produção Industrial",
        shift: "Comercial (08:00 - 17:00)"
    });

    const [timerConfig, setTimerConfig] = useState<{isConfiguring: boolean}>({
        isConfiguring: false
    });

    const [employees] = useState<Employee[]>([
        { id: 1, name: 'João Silva', currentTask: 'Montagem XYZ', status: 'Em Andamento', progress: 75 },
        { id: 2, name: 'Maria Santos', currentTask: 'Inspeção ABC', status: 'Pausa', progress: 45 },
    ]);

    const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([
        {
            id: 1,
            product: 'Produto XYZ',
            quantity: 100,
            deadline: '2024-03-25',
            status: 'Em Produção',
            assignedTo: 'João Silva'
        },
        {
            id: 2,
            product: 'Produto ABC',
            quantity: 50,
            deadline: '2024-03-26',
            status: 'Aguardando',
            assignedTo: 'Maria Santos'
        },
    ]);

    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
    const [newOrder, setNewOrder] = useState<NewProductionOrder>({
        product: '',
        quantity: 0,
        deadline: null,
        assignedTo: ''
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);

    const teams = Object.values(teamsConfig);

    const handleTimerConfigChange = (newTime: number) => {
        setEstimatedTime(newTime);
    };

    const toggleTimerConfig = () => {
        setTimerConfig(prev => ({
            ...prev,
            isConfiguring: !prev.isConfiguring
        }));
    };

    const handleOpenNewOrderModal = () => {
        setIsNewOrderModalOpen(true);
    };

    const handleCloseNewOrderModal = () => {
        setIsNewOrderModalOpen(false);
        setNewOrder({
            product: '',
            quantity: 0,
            deadline: null,
            assignedTo: ''
        });
    };

    const handleNewOrderChange = (field: keyof NewProductionOrder, value: any) => {
        setNewOrder(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddNewOrder = () => {
        if (!newOrder.product || !newOrder.quantity || !newOrder.deadline || !newOrder.assignedTo) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        const formattedDate = newOrder.deadline.toISOString().split('T')[0];
        
        const newProductionOrder: ProductionOrder = {
            id: productionOrders.length + 1,
            product: newOrder.product,
            quantity: newOrder.quantity,
            deadline: formattedDate,
            status: 'Aguardando',
            assignedTo: newOrder.assignedTo
        };

        setProductionOrders((prev: ProductionOrder[]) => [...prev, newProductionOrder]);
        handleCloseNewOrderModal();
    };

    const handleOpenEditModal = (order: ProductionOrder) => {
        setEditingOrder(order);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditingOrder(null);
        setIsEditModalOpen(false);
    };

    const handleEditOrder = () => {
        if (!editingOrder) return;

        setProductionOrders(prev => 
            prev.map(order => 
                order.id === editingOrder.id ? editingOrder : order
            )
        );
        handleCloseEditModal();
    };

    const handleDeleteOrder = (orderId: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta ordem de produção?')) {
            setProductionOrders(prev => prev.filter(order => order.id !== orderId));
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            pt: 3,
            pb: 3,
            width: '100vw',
            overflowX: 'hidden'
        }}>
            <Container 
                maxWidth="xl" 
                sx={{ 
                    mx: 'auto',
                    px: 2
                }}
            >
                {/* Header */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 2, 
                        mb: 3, 
                        backgroundColor: '#1DB954',
                        color: 'white',
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                        Gestão de Produção
                    </Typography>
                </Paper>

                {/* Informações do Administrador */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 2, 
                        mb: 3, 
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#282828', fontWeight: 'bold' }}>
                        {adminInfo.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
                        {adminInfo.role} | Setor: {adminInfo.department} | Turno: {adminInfo.shift}
                    </Typography>
                </Paper>

                {/* Métricas */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                        <Card sx={{ backgroundColor: '#f8f9fa' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total de Equipes
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#1DB954' }}>
                                    {teams.length}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ backgroundColor: '#f8f9fa' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Equipes Ativas
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#1DB954' }}>
                                    3
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ backgroundColor: '#f8f9fa' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Taxa de Conclusão
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#1DB954' }}>
                                    85%
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ backgroundColor: '#f8f9fa' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Eficiência Geral
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#1DB954' }}>
                                    92%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {/* Tabela de Ordens de Produção */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: '#1DB954', fontWeight: 'bold' }}>
                            Ordens de Produção
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Produto</TableCell>
                                        <TableCell>Quantidade</TableCell>
                                        <TableCell>Prazo</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Responsável</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productionOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{order.product}</TableCell>
                                            <TableCell>{order.quantity}</TableCell>
                                            <TableCell>{order.deadline}</TableCell>
                                            <TableCell>{order.status}</TableCell>
                                            <TableCell>{order.assignedTo}</TableCell>
                                            <TableCell>
                                                <IconButton 
                                                    size="small" 
                                                    color="primary"
                                                    onClick={() => handleOpenEditModal(order)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenNewOrderModal}
                                sx={{
                                    backgroundColor: '#1DB954',
                                    '&:hover': {
                                        backgroundColor: '#18a449'
                                    },
                                    px: 4
                                }}
                            >
                                Nova Ordem de Produção
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Status das Equipes */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: '#1DB954', fontWeight: 'bold' }}>
                            Status das Equipes
                        </Typography>
                        <TeamStatusTable />
                    </CardContent>
                </Card>

                {/* Modal de Edição */}
                <Dialog 
                    open={isEditModalOpen} 
                    onClose={handleCloseEditModal}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ 
                        backgroundColor: '#1DB954', 
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        Editar Ordem de Produção
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        {editingOrder && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                <TextField
                                    label="Produto"
                                    value={editingOrder.product}
                                    onChange={(e) => setEditingOrder({
                                        ...editingOrder,
                                        product: e.target.value
                                    })}
                                    fullWidth
                                />
                                <TextField
                                    label="Quantidade"
                                    type="number"
                                    value={editingOrder.quantity}
                                    onChange={(e) => setEditingOrder({
                                        ...editingOrder,
                                        quantity: Number(e.target.value)
                                    })}
                                    fullWidth
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                                    <DatePicker
                                        label="Prazo"
                                        value={new Date(editingOrder.deadline)}
                                        onChange={(date) => setEditingOrder({
                                            ...editingOrder,
                                            deadline: date ? date.toISOString().split('T')[0] : editingOrder.deadline
                                        })}
                                    />
                                </LocalizationProvider>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={editingOrder.status}
                                        label="Status"
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            status: e.target.value
                                        })}
                                    >
                                        <MenuItem value="Aguardando">Aguardando</MenuItem>
                                        <MenuItem value="Em Produção">Em Produção</MenuItem>
                                        <MenuItem value="Concluído">Concluído</MenuItem>
                                        <MenuItem value="Cancelado">Cancelado</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Responsável</InputLabel>
                                    <Select
                                        value={editingOrder.assignedTo}
                                        label="Responsável"
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            assignedTo: e.target.value
                                        })}
                                    >
                                        {employees.map(employee => (
                                            <MenuItem key={employee.id} value={employee.name}>
                                                {employee.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button 
                            onClick={handleCloseEditModal}
                            sx={{ color: '#666' }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleEditOrder}
                            sx={{
                                backgroundColor: '#1DB954',
                                '&:hover': {
                                    backgroundColor: '#18a449'
                                }
                            }}
                        >
                            Salvar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Modal de Nova Ordem */}
                <Dialog 
                    open={isNewOrderModalOpen} 
                    onClose={handleCloseNewOrderModal}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ 
                        backgroundColor: '#1DB954', 
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        Nova Ordem de Produção
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <TextField
                                label="Produto"
                                value={newOrder.product}
                                onChange={(e) => handleNewOrderChange('product', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Quantidade"
                                type="number"
                                value={newOrder.quantity}
                                onChange={(e) => handleNewOrderChange('quantity', Number(e.target.value))}
                                fullWidth
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                                <DatePicker
                                    label="Prazo"
                                    value={newOrder.deadline}
                                    onChange={(date) => handleNewOrderChange('deadline', date)}
                                />
                            </LocalizationProvider>
                            <FormControl fullWidth>
                                <InputLabel>Responsável</InputLabel>
                                <Select
                                    value={newOrder.assignedTo}
                                    label="Responsável"
                                    onChange={(e) => handleNewOrderChange('assignedTo', e.target.value)}
                                >
                                    {employees.map(employee => (
                                        <MenuItem key={employee.id} value={employee.name}>
                                            {employee.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button 
                            onClick={handleCloseNewOrderModal}
                            sx={{ color: '#666' }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleAddNewOrder}
                            sx={{
                                backgroundColor: '#1DB954',
                                '&:hover': {
                                    backgroundColor: '#18a449'
                                }
                            }}
                        >
                            Adicionar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
} 