import React, { useState, useEffect } from 'react';
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
    MenuItem,
    Skeleton
} from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { financialService } from '../../services/api';

interface ProductSaleData {
    category: string;
    unitsSold: string;
    revenue: string;
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
    'Gaming Básico',
    'Gaming Avançado', 
    'Workstation',
    'Office/Corporativo',
    'Entrada/Budget'
];

// Dados dos tipos de computadores (consistente com Planning)
const computerTypes = {
    'Gaming Básico': {
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
    'Gaming Avançado': {
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
    'Workstation': {
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
    'Office/Corporativo': {
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
    'Entrada/Budget': {
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

export default function FinancialInput() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
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
            profitMargin: ''
        }))
    });

    // Carregar dados existentes do backend
    useEffect(() => {
        const loadFinancialData = async () => {
            try {
                setLoadingData(true);
                const data = await financialService.getFinancialData();
                
                // Preencher formulário com dados existentes
                setFormData({
                    operationalCosts: {
                        labor: data.operationalCosts.labor.toString(),
                        components: data.operationalCosts.components.toString(),
                        logistics: data.operationalCosts.logistics.toString(),
                        utilities: data.operationalCosts.utilities.toString(),
                        maintenance: data.operationalCosts.maintenance.toString()
                    },
                    productSales: data.productSales.map(sale => ({
                        category: sale.category,
                        unitsSold: sale.unitsSold.toString(),
                        revenue: sale.revenue.toString(),
                        profitMargin: sale.profitMargin.toString()
                    }))
                });
                
                console.log('✅ Dados financeiros carregados:', data);
            } catch (err) {
                console.error('❌ Erro ao carregar dados financeiros:', err);
                setError('Erro ao carregar dados existentes. Usando formulário vazio.');
            } finally {
                setLoadingData(false);
            }
        };

        loadFinancialData();
    }, []);

    const handleRefreshData = async () => {
        setLoadingData(true);
        setError(null);
        try {
            const data = await financialService.getFinancialData();
            setFormData({
                operationalCosts: {
                    labor: data.operationalCosts.labor.toString(),
                    components: data.operationalCosts.components.toString(),
                    logistics: data.operationalCosts.logistics.toString(),
                    utilities: data.operationalCosts.utilities.toString(),
                    maintenance: data.operationalCosts.maintenance.toString()
                },
                productSales: data.productSales.map(sale => ({
                    category: sale.category,
                    unitsSold: sale.unitsSold.toString(),
                    revenue: sale.revenue.toString(),
                    profitMargin: sale.profitMargin.toString()
                }))
            });
            console.log('✅ Dados atualizados:', data);
        } catch (err) {
            console.error('❌ Erro ao atualizar dados:', err);
            setError('Erro ao atualizar dados.');
        } finally {
            setLoadingData(false);
        }
    };

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
        const value = event.target.value;
        
        setFormData(prev => {
            const newProductSales = [...prev.productSales];
            newProductSales[index] = { ...newProductSales[index], [field]: value };
            
            // Calcular receita e margem automaticamente quando unidades vendidas mudarem
            const sale = newProductSales[index];
            const computerInfo = computerTypes[sale.category as keyof typeof computerTypes];
            
            if (computerInfo && field === 'unitsSold') {
                const unitsSold = parseFloat(value) || 0;
                const basePrice = computerInfo.price;
                
                if (unitsSold > 0) {
                    // Calcular receita total automaticamente
                    const totalRevenue = unitsSold * basePrice;
                    newProductSales[index].revenue = totalRevenue.toFixed(2);
                    
                    // Calcular custos operacionais totais
                    const operationalCosts = prev.operationalCosts;
                    const totalOperationalCosts = 
                        (parseFloat(operationalCosts.labor) || 0) +
                        (parseFloat(operationalCosts.components) || 0) +
                        (parseFloat(operationalCosts.logistics) || 0) +
                        (parseFloat(operationalCosts.utilities) || 0) +
                        (parseFloat(operationalCosts.maintenance) || 0);
                    
                    // Verificar se temos custos operacionais para calcular margem
                    if (totalOperationalCosts > 0) {
                        // Calcular custo por unidade (distribuindo custos operacionais)
                        const totalUnitsAllProducts = newProductSales.reduce((total, product) => {
                            return total + (parseFloat(product.unitsSold) || 0);
                        }, 0);
                        
                        const operationalCostPerUnit = totalUnitsAllProducts > 0 
                            ? totalOperationalCosts / totalUnitsAllProducts 
                            : 0;
                        
                        const totalCostPerUnit = operationalCostPerUnit;
                        const profitPerUnit = basePrice - totalCostPerUnit;
                        const profitMarginPercent = totalCostPerUnit > 0 
                            ? (profitPerUnit / basePrice) * 100 
                            : 0;
                        
                        // Aplicar margem calculada
                        if (profitMarginPercent >= 0) {
                            newProductSales[index].profitMargin = profitMarginPercent.toFixed(1);
                        } else {
                            newProductSales[index].profitMargin = '0.0';
                        }
                    } else {
                        // Se não temos custos operacionais, não podemos calcular margem real
                        newProductSales[index].profitMargin = '0.0';
                    }
                }
            }
            
            return {
                ...prev,
                productSales: newProductSales
            };
        });
    };

    // Função para calcular margem em R$
    const calculateProfitInReais = (sale: ProductSaleData) => {
        const unitsSold = parseFloat(sale.unitsSold) || 0;
        const revenue = parseFloat(sale.revenue) || 0;
        const profitMargin = parseFloat(sale.profitMargin) || 0;
        
        if (unitsSold > 0 && revenue > 0 && profitMargin > 0) {
            const profitInReais = (revenue * profitMargin) / 100;
            return profitInReais;
        }
        return 0;
    };

    // Função para verificar se custos operacionais foram preenchidos
    const hasOperationalCosts = () => {
        const costs = formData.operationalCosts;
        return (parseFloat(costs.labor) || 0) > 0 ||
               (parseFloat(costs.components) || 0) > 0 ||
               (parseFloat(costs.logistics) || 0) > 0 ||
               (parseFloat(costs.utilities) || 0) > 0 ||
               (parseFloat(costs.maintenance) || 0) > 0;
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
                    profitMargin: Number(sale.profitMargin),
                    averagePrice: Number(sale.revenue) / Number(sale.unitsSold) || 0
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                <Button
                    startIcon={loadingData ? <CircularProgress size={20} /> : <RefreshIcon />}
                    onClick={handleRefreshData}
                    disabled={loadingData}
                    variant="outlined"
                    sx={{ 
                        borderColor: '#1DB954',
                        color: '#1DB954',
                        '&:hover': {
                            borderColor: '#18a34b',
                            backgroundColor: 'rgba(29, 185, 84, 0.04)'
                        }
                    }}
                >
                    {loadingData ? 'Carregando...' : 'Atualizar Dados'}
                </Button>
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
                    {loadingData ? (
                        <Grid container spacing={3}>
                            {[1, 2, 3, 4, 5].map(index => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Skeleton variant="rectangular" height={56} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
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
                                        startAdornment: 'R$ ',
                                        inputProps: { min: 0, step: 0.01 }
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
                                    startAdornment: 'R$ ',
                                    inputProps: { min: 0, step: 0.01 }
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
                                    startAdornment: 'R$ ',
                                    inputProps: { min: 0, step: 0.01 }
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
                                    startAdornment: 'R$ ',
                                    inputProps: { min: 0, step: 0.01 }
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
                                    startAdornment: 'R$ ',
                                    inputProps: { min: 0, step: 0.01 }
                                }}
                                helperText="Manutenção de equipamentos e instalações"
                            />
                        </Grid>
                    </Grid>
                    )}
                </Paper>

                {/* Vendas por Categoria */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ color: '#1DB954', fontWeight: 'bold' }}>
                            💻 Vendas de CPUs Produzidas
                        </Typography>
                        <Box sx={{ 
                            backgroundColor: '#e8f5e8', 
                            p: 2, 
                            borderRadius: '8px',
                            border: '1px solid #1DB954'
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1DB954', mb: 1 }}>
                                🧮 Como Funciona o Cálculo Automático
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                <strong>1.</strong> Preencha os custos operacionais acima
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                <strong>2.</strong> Informe apenas as <strong>Unidades Vendidas</strong>
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                <strong>3.</strong> Sistema calcula: <strong>Receita</strong> (unidades × preço) + <strong>Margem</strong> (% e R$)
                            </Typography>
                        </Box>
                    </Box>
                    {loadingData ? (
                        <Grid container spacing={3}>
                            {[1, 2, 3, 4, 5].map(index => (
                                <Grid item xs={12} key={index}>
                                    <Skeleton variant="rectangular" height={120} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Grid container spacing={3}>
                            {formData.productSales.map((sale, index) => {
                                const computerInfo = computerTypes[sale.category as keyof typeof computerTypes];
                                return (
                                    <Grid item xs={12} key={sale.category}>
                                        <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1DB954' }}>
                                                    💻 {sale.category}
                                                </Typography>
                                                {computerInfo && (
                                                    <Typography variant="body2" sx={{ 
                                                        backgroundColor: '#1DB954', 
                                                        color: 'white', 
                                                        px: 2, 
                                                        py: 0.5, 
                                                        borderRadius: '12px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        Preço Base: R$ {computerInfo.price.toLocaleString('pt-BR')}
                                                    </Typography>
                                                )}
                                            </Box>
                                            
                                            {/* Especificações do Computador */}
                                            {computerInfo && (
                                                <Box sx={{ mb: 3, p: 2, backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#666' }}>
                                                        📋 Especificações:
                                                    </Typography>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                                <strong>Processador:</strong> {computerInfo.specs.processor}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                                <strong>Placa-mãe:</strong> {computerInfo.specs.motherboard}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                                <strong>Memória:</strong> {computerInfo.specs.ram}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                                <strong>Armazenamento:</strong> {computerInfo.specs.storage}
                                                            </Typography>
                                                        </Grid>
                                                        {computerInfo.specs.gpu && (
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                                    <strong>Placa de Vídeo:</strong> {computerInfo.specs.gpu}
                                                                </Typography>
                                                            </Grid>
                                                        )}
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                                <strong>Fonte:</strong> {computerInfo.specs.powerSupply}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            )}

                                            {/* Campos de Entrada de Dados */}
                                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: '#666' }}>
                                                📊 Dados de Vendas:
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextField
                                                        fullWidth
                                                        label="Unidades Vendidas"
                                                        type="number"
                                                        value={sale.unitsSold}
                                                        onChange={handleProductSaleChange(index, 'unitsSold')}
                                                        size="small"
                                                        helperText="Quantidade vendida no período"
                                                        InputProps={{
                                                            inputProps: { min: 0, step: 1 }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextField
                                                        fullWidth
                                                        label="Receita Total (Auto)"
                                                        type="number"
                                                        value={sale.revenue}
                                                        InputProps={{
                                                            startAdornment: 'R$ ',
                                                            readOnly: true
                                                        }}
                                                        size="small"
                                                        helperText="Calculada automaticamente"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                backgroundColor: '#f8f9fa',
                                                                '& fieldset': {
                                                                    borderColor: '#dee2e6',
                                                                },
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={4}>
                                                    <Box>
                                                        <TextField
                                                            fullWidth
                                                            label="Margem de Lucro (Auto)"
                                                            type="number"
                                                            value={sale.profitMargin}
                                                            InputProps={{
                                                                endAdornment: '%',
                                                                readOnly: true
                                                            }}
                                                            size="small"
                                                            helperText={`R$ ${calculateProfitInReais(sale).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    backgroundColor: '#f0f8f0',
                                                                    '& fieldset': {
                                                                        borderColor: '#1DB954',
                                                                    },
                                                                },
                                                                '& .MuiInputLabel-root': {
                                                                    color: '#1DB954',
                                                                    fontWeight: 'bold'
                                                                }
                                                            }}
                                                        />
                                                        {!hasOperationalCosts() && (
                                                            <Typography variant="caption" sx={{ color: '#ff6b6b', display: 'block', mt: 0.5 }}>
                                                                ⚠️ Preencha os custos operacionais primeiro
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                    </Grid>
                    )}
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate('/financial')}
                        disabled={loading || loadingData}
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
                        disabled={loading || loadingData}
                        startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                        sx={{ 
                            bgcolor: '#1DB954',
                            '&:hover': {
                                bgcolor: '#18a34b'
                            }
                        }}
                    >
                        {loading ? 'Enviando...' : 'Atualizar Dados Financeiros'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
} 