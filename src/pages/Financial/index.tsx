import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
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
    IconButton,
    Button,
    Fade,
    Zoom,
    useTheme,
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
import { useNavigate } from 'react-router-dom';

interface ProductSales {
    category: string;
    unitsSold: number;
    revenue: number;
    averagePrice: number;
    profitMargin: number;
}

interface FinancialMetrics {
    operationalCosts: {
        labor: number;
        components: number;
        logistics: number;
        utilities: number;
        maintenance: number;
        total: number;
    };
    productSales: ProductSales[];
    totalRevenue: number;
    totalCosts: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
}

// Dados simulados alinhados com categorias do inventário
const mockFinancialData: FinancialMetrics = {
    operationalCosts: {
        labor: 35000,        // Salários e encargos
        components: 180000,  // Compra de componentes
        logistics: 12000,    // Frete, armazenamento
        utilities: 8000,     // Energia, água, telecomunicações
        maintenance: 5000,   // Manutenção de equipamentos
        total: 240000
    },
    productSales: [
        {
            category: 'Processador',
            unitsSold: 85,
            revenue: 80750,
            averagePrice: 950,
            profitMargin: 22
        },
        {
            category: 'Placa de Vídeo',
            unitsSold: 28,
            revenue: 51800,
            averagePrice: 1850,
            profitMargin: 25
        },
        {
            category: 'Placa-mãe',
            unitsSold: 32,
            revenue: 20800,
            averagePrice: 650,
            profitMargin: 20
        },
        {
            category: 'Memória RAM',
            unitsSold: 120,
            revenue: 33600,
            averagePrice: 280,
            profitMargin: 18
        },
        {
            category: 'SSD',
            unitsSold: 95,
            revenue: 30400,
            averagePrice: 320,
            profitMargin: 15
        },
        {
            category: 'Fonte',
            unitsSold: 67,
            revenue: 25460,
            averagePrice: 380,
            profitMargin: 12
        },
        {
            category: 'Periféricos',
            unitsSold: 261,
            revenue: 43520,
            averagePrice: 167,
            profitMargin: 28
        },
        {
            category: 'Software',
            unitsSold: 200,
            revenue: 90000,
            averagePrice: 450,
            profitMargin: 35
        }
    ],
    totalRevenue: 376130,
    totalCosts: 240000,
    grossProfit: 136130,
    netProfit: 98450,
    profitMargin: 26.2
};

export default function Financial() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsLoading(true);
        // Simular carregamento
        setTimeout(() => setIsLoading(false), 1000);
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const getPerformanceColor = (value: number, threshold: number) => {
        return value >= threshold ? '#2E7D32' : '#ff4444';
    };

    return (
        <Fade in={true} timeout={800}>
            <Box sx={{ p: 3 }}>
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
                        💰 Análise Financeira - Hardware de Computadores
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon className={isLoading ? 'rotating' : ''} />}
                            onClick={handleRefresh}
                            sx={{ 
                                borderColor: '#2E7D32',
                                color: '#2E7D32',
                                '&:hover': {
                                    borderColor: '#18a34b',
                                    backgroundColor: 'rgba(29, 185, 84, 0.1)'
                                }
                            }}
                        >
                            Atualizar
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
                            value: mockFinancialData.totalRevenue,
                            icon: <MoneyIcon />,
                            trend: '+12% em relação ao mês anterior',
                            trendIcon: <TrendingUpIcon />,
                            trendColor: '#2E7D32'
                        },
                        {
                            title: 'Lucro Bruto',
                            value: mockFinancialData.grossProfit,
                            icon: <MoneyIcon />,
                            trend: '+15% crescimento mensal',
                            trendIcon: <TrendingUpIcon />,
                            trendColor: '#2E7D32'
                        },
                        {
                            title: 'Lucro Líquido',
                            value: mockFinancialData.netProfit,
                            icon: <MoneyIcon />,
                            trend: `Margem de ${mockFinancialData.profitMargin.toFixed(1)}%`,
                            trendIcon: <TrendingUpIcon />,
                            trendColor: '#2E7D32'
                        },
                        {
                            title: 'Custos Operacionais',
                            value: mockFinancialData.totalCosts,
                            icon: <TimelineIcon />,
                            trend: '63.8% da receita total',
                            trendIcon: <TrendingDownIcon />,
                            trendColor: '#ff4444'
                        }
                    ].map((metric, index) => (
                        <Zoom in={true} style={{ transitionDelay: `${index * 150}ms` }} key={metric.title}>
                            <Card sx={{
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
                        </Zoom>
                    ))}
                </Box>

                {/* Vendas por Categoria de Produto */}
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
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unidades Vendidas</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Receita</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Preço Médio</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Margem de Lucro</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Performance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mockFinancialData.productSales.map((product) => (
                                    <TableRow 
                                        key={product.category}
                                        hover
                                        sx={{
                                            transition: 'background-color 0.2s',
                                            '&:hover': {
                                                backgroundColor: 'rgba(29, 185, 84, 0.05)'
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {product.category}
                                                <Tooltip title={`Total de itens vendidos: ${product.unitsSold}`} arrow>
                                                    <IconButton size="small">
                                                        <InfoIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">{product.unitsSold}</TableCell>
                                        <TableCell align="right">{formatCurrency(product.revenue)}</TableCell>
                                        <TableCell align="right">{formatCurrency(product.averagePrice)}</TableCell>
                                        <TableCell align="right">{product.profitMargin}%</TableCell>
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
                </Paper>

                {/* Detalhamento dos Custos Operacionais */}
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
                        💼 Detalhamento dos Custos Operacionais
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Valor</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>% do Total</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(mockFinancialData.operationalCosts).map(([key, value]) => {
                                    if (key === 'total') return null;
                                    const percentage = (value / mockFinancialData.operationalCosts.total) * 100;
                                    const categoryLabels: Record<string, string> = {
                                        labor: 'Mão de obra',
                                        components: 'Componentes',
                                        logistics: 'Logística',
                                        utilities: 'Utilidades',
                                        maintenance: 'Manutenção'
                                    };
                                    return (
                                        <TableRow 
                                            key={key}
                                            hover
                                            sx={{
                                                transition: 'background-color 0.2s',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(29, 185, 84, 0.05)'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {categoryLabels[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                                                    <Tooltip title="Detalhes sobre este custo" arrow>
                                                        <IconButton size="small">
                                                            <InfoIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">{formatCurrency(value)}</TableCell>
                                            <TableCell align="right">{percentage.toFixed(1)}%</TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={percentage > 50 ? 'Alto' : percentage > 20 ? 'Médio' : 'Baixo'}
                                                    color={percentage > 50 ? 'error' : percentage > 20 ? 'warning' : 'success'}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
} 
