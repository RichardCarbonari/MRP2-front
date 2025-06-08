import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { financialService } from '../../services/api';

interface ProductSaleData {
    category: string;
    unitsSold: string;
    revenue: string;
    averagePrice: string;
    profitMargin: string;
}

interface FormData {
    operationalCosts: {
        labor: string;
        components: string;
        logistics: string;
        utilities: string;
        maintenance: string;
    };
    productSales: ProductSaleData[];
}

const productCategories = [
    'Processador',
    'Placa de Vídeo', 
    'Placa-mãe',
    'Memória RAM',
    'SSD',
    'Fonte',
    'Periféricos',
    'Software'
];

export default function FinancialInput() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        operationalCosts: {
            labor: '',
            components: '',
            logistics: '',
            utilities: '',
            maintenance: ''
        },
        productSales: productCategories.map(category => ({
            category,
            unitsSold: '',
            revenue: '',
            averagePrice: '',
            profitMargin: ''
        }))
    });

    const handleCostChange = (field: keyof typeof formData.operationalCosts) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            operationalCosts: {
                ...prev.operationalCosts,
                [field]: event.target.value
            }
        }));
    };

    const handleProductSaleChange = (index: number, field: keyof ProductSaleData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            productSales: prev.productSales.map((item, i) => 
                i === index ? { ...item, [field]: event.target.value } : item
            )
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Converter strings para números
            const numericalData = {
                operationalCosts: {
                    labor: Number(formData.operationalCosts.labor),
                    components: Number(formData.operationalCosts.components),
                    logistics: Number(formData.operationalCosts.logistics),
                    utilities: Number(formData.operationalCosts.utilities),
                    maintenance: Number(formData.operationalCosts.maintenance),
                    total: 0 // Será calculado no backend
                },
                productSales: formData.productSales.map(sale => ({
                    category: sale.category,
                    unitsSold: Number(sale.unitsSold),
                    revenue: Number(sale.revenue),
                    averagePrice: Number(sale.averagePrice),
                    profitMargin: Number(sale.profitMargin)
                }))
            };

            await financialService.updateFinancialData(numericalData);
            setSuccess(true);
            
            // Limpar formulário após sucesso
            setFormData({
                operationalCosts: {
                    labor: '',
                    components: '',
                    logistics: '',
                    utilities: '',
                    maintenance: ''
                },
                productSales: productCategories.map(category => ({
                    category,
                    unitsSold: '',
                    revenue: '',
                    averagePrice: '',
                    profitMargin: ''
                }))
            });
        } catch (err) {
            setError('Erro ao enviar dados. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/financial')}
                    sx={{ mr: 2, color: '#1DB954' }}
                >
                    Voltar
                </Button>
                <Typography variant="h4" sx={{ color: '#1DB954', fontWeight: 'bold' }}>
                    💰 Entrada de Dados Financeiros - Hardware
                </Typography>
            </Box>

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Dados financeiros enviados com sucesso!
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                {/* Custos Operacionais */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1DB954', fontWeight: 'bold' }}>
                        💼 Custos Operacionais
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mão de obra"
                                type="number"
                                value={formData.operationalCosts.labor}
                                onChange={handleCostChange('labor')}
                                required
                                InputProps={{
                                    startAdornment: 'R$ '
                                }}
                                helperText="Salários e encargos trabalhistas"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Componentes"
                                type="number"
                                value={formData.operationalCosts.components}
                                onChange={handleCostChange('components')}
                                required
                                InputProps={{
                                    startAdornment: 'R$ '
                                }}
                                helperText="Compra de processadores, placas, memórias, etc."
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Logística"
                                type="number"
                                value={formData.operationalCosts.logistics}
                                onChange={handleCostChange('logistics')}
                                required
                                InputProps={{
                                    startAdornment: 'R$ '
                                }}
                                helperText="Frete, armazenamento, distribuição"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Utilidades"
                                type="number"
                                value={formData.operationalCosts.utilities}
                                onChange={handleCostChange('utilities')}
                                required
                                InputProps={{
                                    startAdornment: 'R$ '
                                }}
                                helperText="Energia elétrica, água, telecomunicações"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Manutenção"
                                type="number"
                                value={formData.operationalCosts.maintenance}
                                onChange={handleCostChange('maintenance')}
                                required
                                InputProps={{
                                    startAdornment: 'R$ '
                                }}
                                helperText="Manutenção de equipamentos e instalações"
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Vendas por Categoria */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1DB954', fontWeight: 'bold' }}>
                        📊 Vendas por Categoria de Produto
                    </Typography>
                    <Grid container spacing={3}>
                        {formData.productSales.map((sale, index) => (
                            <Grid item xs={12} key={sale.category}>
                                <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        {sale.category}
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Unidades Vendidas"
                                                type="number"
                                                value={sale.unitsSold}
                                                onChange={handleProductSaleChange(index, 'unitsSold')}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Receita Total"
                                                type="number"
                                                value={sale.revenue}
                                                onChange={handleProductSaleChange(index, 'revenue')}
                                                InputProps={{
                                                    startAdornment: 'R$ '
                                                }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Preço Médio"
                                                type="number"
                                                value={sale.averagePrice}
                                                onChange={handleProductSaleChange(index, 'averagePrice')}
                                                InputProps={{
                                                    startAdornment: 'R$ '
                                                }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Margem de Lucro"
                                                type="number"
                                                value={sale.profitMargin}
                                                onChange={handleProductSaleChange(index, 'profitMargin')}
                                                InputProps={{
                                                    endAdornment: '%'
                                                }}
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate('/financial')}
                        sx={{ 
                            borderColor: '#1DB954',
                            color: '#1DB954'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                        sx={{ 
                            bgcolor: '#1DB954',
                            '&:hover': {
                                bgcolor: '#18a34b'
                            }
                        }}
                    >
                        {loading ? 'Enviando...' : 'Enviar Dados Financeiros'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
} 