import React, { useState, useEffect, memo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Tooltip,
    Button,
    Fade,
    useTheme,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Info as InfoIcon,
    AttachMoney as MoneyIcon,
    Timeline as TimelineIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ProductSales {
    productId: string;
    productName: string;
    category: string;
    subcategory?: string;
    brand: string;
    unitsSold: number;
    revenue: number;
    averagePrice: number;
    profitMargin: number;
    profit: number;
    totalCost: number;
    orderCount: number;
    specifications?: any;
    description?: string;
}

interface FinancialSummary {
    totalRevenue: number;
    totalCosts: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    operationalCosts: {
        labor: number;
        components: number;
        logistics: number;
        utilities: number;
        maintenance: number;
        total: number;
    };
    ordersCount: number;
    avgOrderValue: number;
}

const Financial: React.FC = memo(() => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [salesData, setSalesData] = useState<ProductSales[]>([]);
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 🔄 Função para buscar dados financeiros
    const fetchFinancialData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Buscar vendas por produto específico (CPUs prontas)
            const salesResponse = await axios.get('http://localhost:3006/api/financial/sales-by-product');
            setSalesData(salesResponse.data);

            // Buscar resumo financeiro
            const summaryResponse = await axios.get('http://localhost:3006/api/financial/summary');
            setFinancialSummary(summaryResponse.data);

        } catch (error) {
            console.error('Erro ao buscar dados financeiros:', error);
            setError('Erro ao carregar dados financeiros. Verifique se o servidor está rodando.');
            
            // Dados de fallback em caso de erro
            setSalesData([
                {
                    productId: '1',
                    productName: 'Intel Core i9-13900K',
                    category: 'CPU',
                    subcategory: 'Gaming',
                    brand: 'Intel',
                    unitsSold: 12,
                    revenue: 38400,
                    averagePrice: 3200,
                    profitMargin: 25,
                    profit: 9600,
                    totalCost: 28800,
                    orderCount: 8
                },
                {
                    productId: '2',
                    productName: 'AMD EPYC 9654',
                    category: 'CPU_Servidor',
                    subcategory: 'Datacenter',
                    brand: 'AMD',
                    unitsSold: 3,
                    revenue: 126000,
                    averagePrice: 42000,
                    profitMargin: 24,
                    profit: 30240,
                    totalCost: 95760,
                    orderCount: 2
                },
                {
                    productId: '3',
                    productName: 'NVIDIA RTX 4090',
                    category: 'Placa de Vídeo',
                    subcategory: 'Enthusiast',
                    brand: 'NVIDIA',
                    unitsSold: 6,
                    revenue: 51000,
                    averagePrice: 8500,
                    profitMargin: 24,
                    profit: 12240,
                    totalCost: 38760,
                    orderCount: 4
                },
                {
                    productId: '4',
                    productName: 'DDR5-5600 32GB Kit',
                    category: 'Memória RAM',
                    subcategory: 'High-Performance',
                    brand: 'Corsair',
                    unitsSold: 25,
                    revenue: 30000,
                    averagePrice: 1200,
                    profitMargin: 25,
                    profit: 7500,
                    totalCost: 22500,
                    orderCount: 15
                }
            ]);

            setFinancialSummary({
                totalRevenue: 567000,
                totalCosts: 240000,
                grossProfit: 327000,
                netProfit: 87000,
                profitMargin: 15.3,
                operationalCosts: {
                    labor: 35000,
                    components: 180000,
                    logistics: 12000,
                    utilities: 8000,
                    maintenance: 5000,
                    total: 240000
                },
                ordersCount: 133,
                avgOrderValue: 4263
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Carregar dados ao montar o componente
    useEffect(() => {
        fetchFinancialData();
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const getPerformanceColor = (value: number, threshold: number) => {
        return value >= threshold ? '#2E7D32' : '#ff4444';
    };

    const getCategoryDisplayName = (category: string) => {
        const categoryNames: { [key: string]: string } = {
            'CPU': '🖥️ Processadores Desktop',
            'CPU_Servidor': '🏢 Processadores Servidor',
            'Placa de Vídeo': '🎮 Placas de Vídeo',
            'Memória RAM': '💾 Memória RAM',
            'SSD': '💿 Armazenamento SSD',
            'Placa-mãe': '🔌 Placas-mãe',
            'Fonte': '⚡ Fontes de Alimentação',
            'Periféricos': '🖱️ Periféricos',
            'Software': '💻 Software'
        };
        return categoryNames[category] || category;
    };

    if (!financialSummary) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Fade in={true} timeout={800}>
            <Box sx={{ p: 3 }}>
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
                            color: '#2E7D32', 
                            fontWeight: 'bold',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: 0,
                                width: '60%',
                                height: 4,
                                backgroundColor: '#2E7D32',
                                borderRadius: 2
                            }
                        }}
                    >
                        💰 Análise Financeira - Vendas Reais
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon className={isLoading ? 'rotating' : ''} />}
                            onClick={fetchFinancialData}
                            disabled={isLoading}
                            sx={{ 
                                borderColor: '#2E7D32',
                                color: '#2E7D32',
                                '&:hover': {
                                    borderColor: '#18a34b',
                                    backgroundColor: 'rgba(29, 185, 84, 0.1)'
                                }
                            }}
                        >
                            {isLoading ? 'Atualizando...' : 'Atualizar'}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/financial-input')}
                            sx={{ 
                                bgcolor: '#2E7D32',
                                '&:hover': {
                                    bgcolor: '#18a34b'
                                },
                                boxShadow: '0 4px 6px rgba(29, 185, 84, 0.2)'
                            }}
                        >
                            Adicionar Dados
                        </Button>
                    </Box>
                </Box>

                {/* Alert de Erro */}
                {error && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Métricas Principais */}
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
                    gap: 3, 
                    mb: 4 
                }}>
                    {[
                        {
                            title: 'Receita Total',
                            value: financialSummary.totalRevenue,
                            icon: <MoneyIcon />,
                            trend: `${financialSummary.ordersCount} pedidos`,
                            trendIcon: <TrendingUpIcon />,
                            trendColor: '#2E7D32'
                        },
                        {
                            title: 'Lucro Bruto',
                            value: financialSummary.grossProfit,
                            icon: <MoneyIcon />,
                            trend: 'Antes dos custos operacionais',
                            trendIcon: <TrendingUpIcon />,
                            trendColor: '#2E7D32'
                        },
                        {
                            title: 'Lucro Líquido',
                            value: financialSummary.netProfit,
                            icon: <MoneyIcon />,
                            trend: `Margem de ${financialSummary.profitMargin.toFixed(1)}%`,
                            trendIcon: financialSummary.netProfit > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />,
                            trendColor: financialSummary.netProfit > 0 ? '#2E7D32' : '#ff4444'
                        },
                        {
                            title: 'Ticket Médio',
                            value: financialSummary.avgOrderValue,
                            icon: <TimelineIcon />,
                            trend: 'Por pedido',
                            trendIcon: <InfoIcon />,
                            trendColor: '#2E7D32'
                        }
                    ].map((metric, index) => (
                        <Card key={metric.title} sx={{
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
                                        color: '#2E7D32',
                                        mr: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(29, 185, 84, 0.1)'
                                    }}>
                                        {metric.icon}
                                    </Box>
                                    <Typography variant="h6" fontSize="0.9rem">{metric.title}</Typography>
                                </Box>

                                <Typography variant="h4" sx={{ 
                                    color: getPerformanceColor(metric.value, 0),
                                    fontWeight: 'bold',
                                    fontSize: '1.8rem'
                                }}>
                                    {formatCurrency(metric.value)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <Box sx={{ 
                                        color: metric.trendColor,
                                        mr: 1,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        {metric.trendIcon}
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                        {metric.trend}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* 📊 Vendas por Categoria de Produto */}
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
                            backgroundColor: '#2E7D32',
                            borderRadius: 2
                        }
                    }}>
                        📊 Vendas por Categoria de Produto
                    </Typography>
                    
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" p={4}>
                            <CircularProgress />
                        </Box>
                    ) : salesData.length === 0 ? (
                        <Alert severity="info">
                            Nenhuma venda encontrada. Adicione alguns pedidos para ver os dados financeiros.
                        </Alert>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>CPU Montada</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Marca</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unidades Vendidas</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Receita</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Preço Médio</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Margem</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Performance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salesData
                                        .filter(product => product.category === 'CPU' || product.category === 'CPU_Servidor')
                                        .sort((a, b) => b.revenue - a.revenue)
                                        .map((product) => (
                                        <TableRow 
                                            key={product.productId}
                                            hover
                                            sx={{
                                                transition: 'background-color 0.2s',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(29, 185, 84, 0.05)'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {product.productName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {product.subcategory} • {product.orderCount} pedidos
                                                    </Typography>
                                                    {product.description && (
                                                        <Tooltip 
                                                            title={
                                                                <Box>
                                                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                                                        Descrição e Componentes:
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                                                        {product.description}
                                                                    </Typography>
                                                                </Box>
                                                            } 
                                                            arrow
                                                        >
                                                            <IconButton size="small" sx={{ alignSelf: 'flex-start', p: 0.5 }}>
                                                                <InfoIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip 
                                                    label={product.brand} 
                                                    size="small" 
                                                    variant="outlined"
                                                    color={product.brand === 'Intel' ? 'primary' : 'secondary'}
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip 
                                                    label={product.category === 'CPU_Servidor' ? 'Servidor' : 'Desktop'} 
                                                    size="small" 
                                                    color={product.category === 'CPU_Servidor' ? 'warning' : 'success'}
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight="bold">
                                                    {product.unitsSold}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight="bold" color="primary">
                                                    {formatCurrency(product.revenue)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">{formatCurrency(product.averagePrice)}</TableCell>
                                            <TableCell align="right">
                                                <Typography 
                                                    variant="body2" 
                                                    fontWeight="bold"
                                                    color={product.profitMargin >= 20 ? 'success.main' : product.profitMargin >= 15 ? 'warning.main' : 'error.main'}
                                                >
                                                    {product.profitMargin.toFixed(1)}%
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={
                                                        product.profitMargin >= 25 ? 'Excelente' : 
                                                        product.profitMargin >= 20 ? 'Bom' :
                                                        product.profitMargin >= 15 ? 'Regular' : 'Baixo'
                                                    }
                                                    color={
                                                        product.profitMargin >= 25 ? 'success' :
                                                        product.profitMargin >= 20 ? 'primary' :
                                                        product.profitMargin >= 15 ? 'warning' : 'error'
                                                    }
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

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
        </Fade>
    );
});

export default Financial; 