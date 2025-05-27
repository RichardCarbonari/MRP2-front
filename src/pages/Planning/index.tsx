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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ptBR from 'date-fns/locale/pt-BR';

interface ProductionOrder {
    id: string;
    product: string;
    quantity: number;
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'high' | 'medium' | 'low';
    team: string;
}

export default function Planning() {
    const [orders, setOrders] = useState<ProductionOrder[]>([
        {
            id: 'OP001',
            product: 'Processador i7',
            quantity: 100,
            startDate: new Date('2024-03-25'),
            endDate: new Date('2024-03-30'),
            status: 'pending',
            priority: 'high',
            team: 'Equipe A'
        },
        {
            id: 'OP002',
            product: 'Placa-mãe Gaming',
            quantity: 50,
            startDate: new Date('2024-03-26'),
            endDate: new Date('2024-04-02'),
            status: 'in_progress',
            priority: 'medium',
            team: 'Equipe B'
        },
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);

    const handleAddOrder = () => {
        setSelectedOrder(null);
        setOpenDialog(true);
    };

    const handleEditOrder = (order: ProductionOrder) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    const getStatusColor = (status: ProductionOrder['status']) => {
        switch (status) {
            case 'pending':
                return '#ff9800';
            case 'in_progress':
                return '#2196f3';
            case 'completed':
                return '#4caf50';
            default:
                return '#666';
        }
    };

    const getStatusText = (status: ProductionOrder['status']) => {
        switch (status) {
            case 'pending':
                return 'Pendente';
            case 'in_progress':
                return 'Em Produção';
            case 'completed':
                return 'Concluído';
            default:
                return status;
        }
    };

    const getPriorityColor = (priority: ProductionOrder['priority']) => {
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

    const getPriorityText = (priority: ProductionOrder['priority']) => {
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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Planejamento de Produção
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Ordens em Aberto
                                </Typography>
                                <Typography variant="h4">
                                    {orders.filter(o => o.status === 'pending').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Em Produção
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#2196f3' }}>
                                    {orders.filter(o => o.status === 'in_progress').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Concluídas
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#4caf50' }}>
                                    {orders.filter(o => o.status === 'completed').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                        Ordens de Produção
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddOrder}
                        sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#18a449' } }}
                    >
                        Nova Ordem
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Produto</TableCell>
                                <TableCell align="right">Quantidade</TableCell>
                                <TableCell>Data Início</TableCell>
                                <TableCell>Data Fim</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Prioridade</TableCell>
                                <TableCell>Equipe</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.product}</TableCell>
                                    <TableCell align="right">{order.quantity}</TableCell>
                                    <TableCell>{order.startDate.toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell>{order.endDate.toLocaleDateString('pt-BR')}</TableCell>
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
                                    <TableCell>{order.team}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEditOrder(order)}
                                            sx={{ color: '#1DB954' }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Dialog para adicionar/editar ordem */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedOrder ? 'Editar Ordem de Produção' : 'Nova Ordem de Produção'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Produto"
                            defaultValue={selectedOrder?.product}
                        />
                        <TextField
                            fullWidth
                            label="Quantidade"
                            type="number"
                            defaultValue={selectedOrder?.quantity}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                            <DatePicker
                                label="Data de Início"
                                defaultValue={selectedOrder?.startDate}
                                sx={{ width: '100%' }}
                            />
                            <DatePicker
                                label="Data de Término"
                                defaultValue={selectedOrder?.endDate}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                        <TextField
                            fullWidth
                            label="Equipe Responsável"
                            defaultValue={selectedOrder?.team}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ 
                            backgroundColor: '#1DB954',
                            '&:hover': { backgroundColor: '#18a449' }
                        }}
                    >
                        {selectedOrder ? 'Salvar' : 'Criar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 