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
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';

interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    value: number;
    unit: string;
    category: string;
    location: string;
    lastUpdated: Date;
}

export default function Inventory() {
    const [items, setItems] = useState<InventoryItem[]>([
        // 🔹 PROCESSADORES
        {
            id: 'CPU001',
            name: 'Intel Core i5-13400F - 10 núcleos, 16 threads, LGA1700, 65W',
            quantity: 85,
            value: 950.00,
            unit: 'unidade',
            category: 'Processador',
            location: 'Estante A1 - Prateleira 1',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 COOLERS
        {
            id: 'COOL001',
            name: 'Cooler Master Hyper 212 Black Edition - Air Cooler com 4 heatpipes',
            quantity: 45,
            value: 120.00,
            unit: 'unidade',
            category: 'Cooler',
            location: 'Estante A2 - Prateleira 1',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 PLACAS-MÃE
        {
            id: 'MB001',
            name: 'ASUS TUF B660M-PLUS WiFi D4 - mATX, LGA1700, DDR4',
            quantity: 32,
            value: 650.00,
            unit: 'unidade',
            category: 'Placa-mãe',
            location: 'Estante A3 - Prateleira 1',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 MEMÓRIA RAM
        {
            id: 'RAM001',
            name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz - Dual Channel',
            quantity: 120,
            value: 280.00,
            unit: 'kit',
            category: 'Memória RAM',
            location: 'Estante A4 - Prateleira 1-2',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 ARMAZENAMENTO
        {
            id: 'SSD001',
            name: 'Kingston NV2 1TB NVMe PCIe 4.0 - Leitura até 3.500MB/s',
            quantity: 95,
            value: 320.00,
            unit: 'unidade',
            category: 'SSD',
            location: 'Estante A5 - Prateleira 1',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 PLACAS DE VÍDEO
        {
            id: 'GPU001',
            name: 'NVIDIA GeForce RTX 3060 12GB - GDDR6, PCIe 4.0, 170W',
            quantity: 28,
            value: 1850.00,
            unit: 'unidade',
            category: 'Placa de Vídeo',
            location: 'Estante B1 - Prateleira 1 (Climatizada)',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 FONTES DE ALIMENTAÇÃO
        {
            id: 'PSU001',
            name: 'Corsair CV550 550W 80 Plus Bronze - ATX, PFC Ativo',
            quantity: 67,
            value: 380.00,
            unit: 'unidade',
            category: 'Fonte',
            location: 'Estante B2 - Prateleira 1-2',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 GABINETES
        {
            id: 'CASE001',
            name: 'Cooler Master Q300L - mATX, ventilação frontal/lateral',
            quantity: 22,
            value: 180.00,
            unit: 'unidade',
            category: 'Gabinete',
            location: 'Depósito C - Área de Grandes Volumes',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 PLACAS DE REDE
        {
            id: 'NET001',
            name: 'TP-Link Archer T6E - PCIe, Dual Band, 802.11ac',
            quantity: 35,
            value: 140.00,
            unit: 'unidade',
            category: 'Placa de Rede',
            location: 'Estante A6 - Prateleira 1',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 UNIDADES ÓPTICAS
        {
            id: 'OPT001',
            name: 'LG DVD Writer GH24NSD1 - Leitor/Gravador DVD',
            quantity: 18,
            value: 85.00,
            unit: 'unidade',
            category: 'Drive Óptico',
            location: 'Estante A7 - Prateleira 1',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 SISTEMA OPERACIONAL
        {
            id: 'OS001',
            name: 'Windows 11 Pro OEM - 64 bits, ativação OEM',
            quantity: 200,
            value: 450.00,
            unit: 'licença',
            category: 'Software',
            location: 'Estoque Digital - Servidor de Licenças',
            lastUpdated: new Date('2024-12-20')
        },
        
        // 🔹 PERIFÉRICOS
        {
            id: 'KB001',
            name: 'Teclado Mecânico Gamer RGB - Switches Blue',
            quantity: 75,
            value: 250.00,
            unit: 'unidade',
            category: 'Periféricos',
            location: 'Estante D1 - Prateleira 1',
            lastUpdated: new Date('2024-12-20')
        },
        {
            id: 'MS001',
            name: 'Mouse Gamer 6400 DPI RGB - Sensor Óptico',
            quantity: 88,
            value: 150.00,
            unit: 'unidade',
            category: 'Periféricos',
            location: 'Estante D1 - Prateleira 2',
            lastUpdated: new Date('2024-12-20')
        },
        {
            id: 'MON001',
            name: 'Monitor LED 24" Full HD IPS - 75Hz, HDMI/VGA',
            quantity: 42,
            value: 680.00,
            unit: 'unidade',
            category: 'Periféricos',
            location: 'Depósito D - Área de Monitores',
            lastUpdated: new Date('2024-12-20')
        },
        {
            id: 'WEB001',
            name: 'Webcam Full HD 1080p - Microfone integrado, USB',
            quantity: 56,
            value: 120.00,
            unit: 'unidade',
            category: 'Periféricos',
            location: 'Estante D2 - Prateleira 1',
            lastUpdated: new Date('2024-12-20')
        }
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const handleAddItem = () => {
        setSelectedItem(null);
        setOpenDialog(true);
    };

    const handleEditItem = (item: InventoryItem) => {
        setSelectedItem(item);
        setOpenDialog(true);
    };

    const getLowStockItems = () => {
        return items.filter(item => item.quantity < 10); // Usando limite fixo já que removemos minQuantity
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                🖥️ Gestão de Estoque - Hardware de Computadores
            </Typography>

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

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Categoria</TableCell>
                                        <TableCell align="right">Quantidade</TableCell>
                                        <TableCell align="right">Valor Unit.</TableCell>
                                        <TableCell>Localização</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Última Atualização</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell align="right">
                                                {item.quantity} {item.unit}
                                            </TableCell>
                                            <TableCell align="right">
                                                R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell>{item.location}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={item.quantity < 10 ? 'Estoque Baixo' : 'Normal'}
                                                    color={item.quantity < 10 ? 'warning' : 'success'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {item.lastUpdated.toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditItem(item)}
                                                    sx={{ color: '#2E7D32' }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialog para adicionar/editar item */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedItem ? 'Editar Item' : 'Novo Item'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Nome do Item"
                            defaultValue={selectedItem?.name}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Quantidade"
                                    type="number"
                                    defaultValue={selectedItem?.quantity}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Unidade"
                                    defaultValue={selectedItem?.unit}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            label="Valor (R$)"
                            type="number"
                            defaultValue={selectedItem?.value}
                            InputProps={{
                                inputProps: { min: 0, step: 0.01 }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Categoria"
                            defaultValue={selectedItem?.category}
                        />
                        <TextField
                            fullWidth
                            label="Localização"
                            defaultValue={selectedItem?.location}
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
                            backgroundColor: '#2E7D32',
                            '&:hover': { backgroundColor: '#18a449' }
                        }}
                    >
                        {selectedItem ? 'Salvar' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 
