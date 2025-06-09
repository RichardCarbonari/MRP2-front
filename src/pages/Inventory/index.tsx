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
    Alert,
    Divider,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';
import { inventoryService, InventoryItem as InventoryItemAPI, Tool as ToolAPI } from '../../services/api';

type InventoryItem = InventoryItemAPI;
type Tool = ToolAPI;

export default function Inventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregar dados do backend
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [itemsData, toolsData] = await Promise.all([
                    inventoryService.getItems(),
                    inventoryService.getTools()
                ]);
                setItems(itemsData);
                setTools(toolsData);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError('Erro ao carregar dados do inventário');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: InventoryItem | null }>({
        open: false,
        item: null
    });
    const [deleteToolDialog, setDeleteToolDialog] = useState<{ open: boolean; tool: Tool | null }>({
        open: false,
        tool: null
    });
    const [toolDialog, setToolDialog] = useState(false);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

    const handleAddItem = () => {
        setSelectedItem(null);
        setOpenDialog(true);
    };

    const handleEditItem = (item: InventoryItem) => {
        setSelectedItem(item);
        setOpenDialog(true);
    };

    const handleDeleteClick = (item: InventoryItem) => {
        setDeleteDialog({ open: true, item });
    };

    const handleDeleteConfirm = async () => {
        if (deleteDialog.item) {
            try {
                await inventoryService.deleteItem(deleteDialog.item.id);
                setItems(prevItems => prevItems.filter(item => item.id !== deleteDialog.item!.id));
                setDeleteDialog({ open: false, item: null });
            } catch (error) {
                console.error('Erro ao deletar item:', error);
                setError('Erro ao deletar item');
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, item: null });
    };

    const handleEditTool = (tool: Tool) => {
        setSelectedTool(tool);
        setToolDialog(true);
    };

    const handleDeleteTool = (tool: Tool) => {
        setDeleteToolDialog({ open: true, tool });
    };

    const handleDeleteToolConfirm = async () => {
        if (deleteToolDialog.tool) {
            try {
                await inventoryService.deleteTool(deleteToolDialog.tool.id);
                setTools(prevTools => prevTools.filter(tool => tool.id !== deleteToolDialog.tool!.id));
                setDeleteToolDialog({ open: false, tool: null });
            } catch (error) {
                console.error('Erro ao deletar ferramenta:', error);
                setError('Erro ao deletar ferramenta');
            }
        }
    };

    const handleDeleteToolCancel = () => {
        setDeleteToolDialog({ open: false, tool: null });
    };

    // Função para salvar item (novo ou editado)
    const handleItemSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const itemData = {
            name: formData.get('name') as string,
            quantity: parseInt(formData.get('quantity') as string),
            value: parseFloat(formData.get('value') as string),
            unit: formData.get('unit') as string,
            category: formData.get('category') as string,
            location: formData.get('location') as string,
        };

        try {
            if (selectedItem) {
                // Editar item existente
                const updatedItem = await inventoryService.updateItem(selectedItem.id, itemData);
                setItems(prevItems => 
                    prevItems.map(item => 
                        item.id === selectedItem.id ? updatedItem : item
                    )
                );
            } else {
                // Criar novo item
                const newItem = await inventoryService.createItem(itemData);
                setItems(prevItems => [...prevItems, newItem]);
            }
            setOpenDialog(false);
            setSelectedItem(null);
        } catch (error) {
            console.error('Erro ao salvar item:', error);
            setError('Erro ao salvar item');
        }
    };

    // Função para salvar ferramenta (nova ou editada)
    const handleToolSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const toolData = {
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            quantity: parseInt(formData.get('quantity') as string),
            condition: formData.get('condition') as Tool['condition'],
            location: formData.get('location') as string,
        };

        try {
            if (selectedTool) {
                // Editar ferramenta existente
                const updatedTool = await inventoryService.updateTool(selectedTool.id, toolData);
                setTools(prevTools => 
                    prevTools.map(tool => 
                        tool.id === selectedTool.id ? updatedTool : tool
                    )
                );
            } else {
                // Criar nova ferramenta
                const newTool = await inventoryService.createTool(toolData);
                setTools(prevTools => [...prevTools, newTool]);
            }
            setToolDialog(false);
            setSelectedTool(null);
        } catch (error) {
            console.error('Erro ao salvar ferramenta:', error);
            setError('Erro ao salvar ferramenta');
        }
    };

    const getLowStockItems = () => {
        return items.filter(item => item.quantity < 10);
    };

    const getConditionColor = (condition: Tool['condition']) => {
        switch (condition) {
            case 'excellent': return '#2E7D32';
            case 'good': return '#1976D2';
            case 'fair': return '#F57C00';
            case 'needs_maintenance': return '#D32F2F';
            default: return '#757575';
        }
    };

    const getConditionLabel = (condition: Tool['condition']) => {
        switch (condition) {
            case 'excellent': return 'Excelente';
            case 'good': return 'Boa';
            case 'fair': return 'Regular';
            case 'needs_maintenance': return 'Manutenção';
            default: return 'N/A';
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ color: '#2E7D32', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                        Carregando inventário...
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                🖥️ Gestão de Estoque - Hardware de Computadores
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total de Itens
                            </Typography>
                            <Typography variant="h4">
                                {items.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Itens com Estoque Baixo
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#ff9800' }}>
                                {getLowStockItems().length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Valor Total em Estoque
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#2E7D32' }}>
                                R$ {items.reduce((total, item) => total + (item.quantity * item.value), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {getLowStockItems().length > 0 && (
                <Alert 
                    severity="warning" 
                    icon={<WarningIcon />}
                    sx={{ mb: 3 }}
                >
                    Existem {getLowStockItems().length} itens com estoque baixo (menos de 10 unidades).
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Tabela de Itens */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">
                                Itens em Estoque
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddItem}
                                sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#18a449' } }}
                            >
                                Novo Item
                            </Button>
                        </Box>

                        <TableContainer sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Nome</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Categoria</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Quantidade</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Valor Unit.</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Localização</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Última Atualização</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow 
                                            key={item.id}
                                            sx={{ 
                                                '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                                                '&:hover': { 
                                                    backgroundColor: '#e8f5e8',
                                                    transition: 'background-color 0.2s'
                                                }
                                            }}
                                        >
                                            <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>{item.id}</TableCell>
                                            <TableCell sx={{ maxWidth: 300 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                    {item.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={item.category} 
                                                    size="small" 
                                                    variant="outlined"
                                                    sx={{ borderColor: '#2E7D32', color: '#2E7D32' }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 0.5 }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {item.unit}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                                    R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="textSecondary">
                                                    {item.location}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={item.quantity < 10 ? 'Estoque Baixo' : 'Normal'}
                                                    color={item.quantity < 10 ? 'warning' : 'success'}
                                                    size="small"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="textSecondary">
                                                    {new Date(item.lastUpdated).toLocaleDateString('pt-BR')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditItem(item)}
                                                        sx={{ 
                                                            color: '#2E7D32',
                                                            '&:hover': { backgroundColor: '#e8f5e8' }
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteClick(item)}
                                                        sx={{ 
                                                            color: '#D32F2F',
                                                            '&:hover': { backgroundColor: '#ffebee' }
                                                        }}
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
                </Grid>

                {/* Seção de Ferramentas para Montagem de CPUs */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BuildIcon sx={{ color: '#2E7D32', mr: 2, fontSize: 32 }} />
                                <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                                    🔧 Ferramentas para Montagem de CPUs
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setSelectedTool(null);
                                    setToolDialog(true);
                                }}
                                sx={{ 
                                    backgroundColor: '#1976D2', 
                                    '&:hover': { backgroundColor: '#1565C0' },
                                    borderRadius: 2
                                }}
                            >
                                Nova Ferramenta
                            </Button>
                        </Box>

                        <TableContainer sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Nome</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Tipo</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Quantidade</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Localização</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Condição</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Última Manutenção</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tools.map((tool, index) => (
                                        <TableRow 
                                            key={tool.id}
                                            sx={{ 
                                                '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                                                '&:hover': { 
                                                    backgroundColor: '#e8f5e8',
                                                    transition: 'background-color 0.2s'
                                                }
                                            }}
                                        >
                                            <TableCell sx={{ fontWeight: 'bold', color: '#2E7D32' }}>{tool.id}</TableCell>
                                            <TableCell sx={{ maxWidth: 300 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                    {tool.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={tool.type} 
                                                    size="small" 
                                                    variant="outlined"
                                                    sx={{ borderColor: '#1976D2', color: '#1976D2' }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 0.5 }}>
                                                        {tool.quantity}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        unidades
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="textSecondary">
                                                    {tool.location}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getConditionLabel(tool.condition)}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${getConditionColor(tool.condition)}20`,
                                                        color: getConditionColor(tool.condition),
                                                        fontWeight: 'bold',
                                                        border: `1px solid ${getConditionColor(tool.condition)}40`
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="textSecondary">
                                                    {new Date(tool.lastMaintenance).toLocaleDateString('pt-BR')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditTool(tool)}
                                                        sx={{ 
                                                            color: '#2E7D32',
                                                            '&:hover': { backgroundColor: '#e8f5e8' }
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteTool(tool)}
                                                        sx={{ 
                                                            color: '#D32F2F',
                                                            '&:hover': { backgroundColor: '#ffebee' }
                                                        }}
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

                        <Box sx={{ mt: 4, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: '#2E7D32', mb: 2, display: 'flex', alignItems: 'center' }}>
                                <HandymanIcon sx={{ mr: 1 }} />
                                Instruções de Uso das Ferramentas
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>🔧 Chaves de Fenda:</strong> Sempre usar chaves magnéticas para evitar perda de parafusos
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>⚡ Pulseira ESD:</strong> Obrigatória durante toda montagem para proteção antiestática
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>🌡️ Pasta Térmica:</strong> Aplicar camada fina entre CPU e cooler
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>🔍 Multímetro:</strong> Verificar tensões antes de conectar componentes
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>💨 Soprador:</strong> Limpeza de componentes antes da montagem
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>💡 Lanterna:</strong> Iluminação adequada durante montagem em gabinetes
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialog para adicionar/editar item */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <form onSubmit={handleItemSubmit}>
                    <DialogTitle sx={{ backgroundColor: '#f5f5f5', color: '#2E7D32' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {selectedItem ? <EditIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
                            {selectedItem ? 'Editar Item' : 'Novo Item'}
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                fullWidth
                                label="Nome do Item"
                                name="name"
                                defaultValue={selectedItem?.name}
                                variant="outlined"
                                required
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Quantidade"
                                        name="quantity"
                                        type="number"
                                        defaultValue={selectedItem?.quantity}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Unidade"
                                        name="unit"
                                        defaultValue={selectedItem?.unit}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <TextField
                                fullWidth
                                label="Valor (R$)"
                                name="value"
                                type="number"
                                defaultValue={selectedItem?.value}
                                variant="outlined"
                                required
                                InputProps={{
                                    inputProps: { min: 0, step: 0.01 }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Categoria"
                                name="category"
                                defaultValue={selectedItem?.category}
                                variant="outlined"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Localização"
                                name="location"
                                defaultValue={selectedItem?.location}
                                variant="outlined"
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenDialog(false)} size="large" type="button">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={selectedItem ? <EditIcon /> : <AddIcon />}
                            sx={{ 
                                backgroundColor: '#2E7D32',
                                '&:hover': { backgroundColor: '#1B5E20' }
                            }}
                        >
                            {selectedItem ? 'Salvar Alterações' : 'Adicionar Item'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dialog de confirmação de delete item */}
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
                    Confirmar Exclusão do Item
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Tem certeza que deseja excluir o item:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1, color: '#D32F2F' }}>
                        {deleteDialog.item?.name}
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

            {/* Dialog para editar ferramenta */}
            <Dialog open={toolDialog} onClose={() => setToolDialog(false)} maxWidth="md" fullWidth>
                <form onSubmit={handleToolSubmit}>
                    <DialogTitle sx={{ backgroundColor: '#f5f5f5', color: '#2E7D32' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HandymanIcon sx={{ mr: 1 }} />
                            {selectedTool ? 'Editar Ferramenta' : 'Nova Ferramenta'}
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                fullWidth
                                label="Nome da Ferramenta"
                                name="name"
                                defaultValue={selectedTool?.name}
                                variant="outlined"
                                required
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Tipo"
                                        name="type"
                                        defaultValue={selectedTool?.type}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Quantidade"
                                        name="quantity"
                                        type="number"
                                        defaultValue={selectedTool?.quantity}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <TextField
                                fullWidth
                                label="Localização"
                                name="location"
                                defaultValue={selectedTool?.location}
                                variant="outlined"
                                required
                            />
                            <TextField
                                fullWidth
                                select
                                label="Condição"
                                name="condition"
                                defaultValue={selectedTool?.condition || 'excellent'}
                                variant="outlined"
                                required
                            >
                                <MenuItem value="excellent">Excelente</MenuItem>
                                <MenuItem value="good">Boa</MenuItem>
                                <MenuItem value="fair">Regular</MenuItem>
                                <MenuItem value="needs_maintenance">Necessita Manutenção</MenuItem>
                            </TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setToolDialog(false)} size="large" type="button">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={<HandymanIcon />}
                            sx={{ 
                                backgroundColor: '#2E7D32',
                                '&:hover': { backgroundColor: '#1B5E20' }
                            }}
                        >
                            {selectedTool ? 'Salvar Alterações' : 'Adicionar Ferramenta'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dialog de confirmação de delete ferramenta */}
            <Dialog
                open={deleteToolDialog.open}
                onClose={handleDeleteToolCancel}
                PaperProps={{
                    sx: {
                        borderTop: '4px solid #D32F2F'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#D32F2F', display: 'flex', alignItems: 'center' }}>
                    <DeleteIcon sx={{ mr: 1 }} />
                    Confirmar Exclusão da Ferramenta
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Tem certeza que deseja excluir a ferramenta:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1, color: '#D32F2F' }}>
                        {deleteToolDialog.tool?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Esta ação não pode ser desfeita.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteToolCancel}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDeleteToolConfirm}
                        variant="contained" 
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Excluir Ferramenta
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 
