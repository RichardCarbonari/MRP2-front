import React from 'react';
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
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Info as InfoIcon,
    AttachMoney as MoneyIcon,
    Timeline as TimelineIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface FinancialMetrics {
    operationalCosts: {
        labor: number;
        materials: number;
        equipment: number;
        utilities: number;
        maintenance: number;
        total: number;
    };
    revenue: {
        totalSales: number;
        averageUnitPrice: number;
        unitsProduced: number;
    };
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
}

// Dados simulados
const mockFinancialData: FinancialMetrics = {
    operationalCosts: {
        labor: 45000,
        materials: 75000,
        equipment: 15000,
        utilities: 8000,
        maintenance: 12000,
        total: 155000
    },
    revenue: {
        totalSales: 250000,
        averageUnitPrice: 2500,
        unitsProduced: 100
    },
    grossProfit: 95000,
    netProfit: 70000,
    profitMargin: 28
};

export default function Financial() {
    const navigate = useNavigate();

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const getPerformanceColor = (value: number, threshold: number) => {
        return value >= threshold ? '#1DB954' : '#ff4444';
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: '#1DB954', fontWeight: 'bold' }}>
                    Análise Financeira
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/financeiro/entrada')}
                    sx={{ 
                        bgcolor: '#1DB954',
                        '&:hover': {
                            bgcolor: '#18a34b'
                        }
                    }}
                >
                    Adicionar Dados
                </Button>
            </Box>

            {/* Métricas Principais */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
                gap: 3, 
                mb: 4 
            }}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MoneyIcon sx={{ color: '#1DB954', mr: 1 }} />
                            <Typography variant="h6">Lucro Bruto</Typography>
                        </Box>
                        <Typography variant="h4" sx={{ color: getPerformanceColor(mockFinancialData.grossProfit, 0) }}>
                            {formatCurrency(mockFinancialData.grossProfit)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <TrendingUpIcon sx={{ color: '#1DB954', mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">
                                +15% em relação ao mês anterior
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MoneyIcon sx={{ color: '#1DB954', mr: 1 }} />
                            <Typography variant="h6">Lucro Líquido</Typography>
                        </Box>
                        <Typography variant="h4" sx={{ color: getPerformanceColor(mockFinancialData.netProfit, 0) }}>
                            {formatCurrency(mockFinancialData.netProfit)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <TrendingUpIcon sx={{ color: '#1DB954', mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">
                                Margem de {mockFinancialData.profitMargin}%
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TimelineIcon sx={{ color: '#1DB954', mr: 1 }} />
                            <Typography variant="h6">Custos Operacionais</Typography>
                        </Box>
                        <Typography variant="h4" sx={{ color: getPerformanceColor(-mockFinancialData.operationalCosts.total, -200000) }}>
                            {formatCurrency(mockFinancialData.operationalCosts.total)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <TrendingDownIcon sx={{ color: '#ff4444', mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">
                                62% da receita total
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Detalhamento dos Custos Operacionais */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Detalhamento dos Custos Operacionais
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Categoria</TableCell>
                                <TableCell align="right">Valor</TableCell>
                                <TableCell align="right">% do Total</TableCell>
                                <TableCell align="right">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(mockFinancialData.operationalCosts).map(([key, value]) => {
                                if (key === 'total') return null;
                                const percentage = (value / mockFinancialData.operationalCosts.total) * 100;
                                return (
                                    <TableRow key={key}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                                <Tooltip title="Detalhes sobre este custo">
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
                                                label={percentage > 30 ? 'Alto' : percentage > 15 ? 'Médio' : 'Baixo'}
                                                color={percentage > 30 ? 'error' : percentage > 15 ? 'warning' : 'success'}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Indicadores de Produção */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Indicadores de Produção
                </Typography>
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
                    gap: 3 
                }}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Unidades Produzidas
                            </Typography>
                            <Typography variant="h4">
                                {mockFinancialData.revenue.unitsProduced}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Preço Médio por Unidade
                            </Typography>
                            <Typography variant="h4">
                                {formatCurrency(mockFinancialData.revenue.averageUnitPrice)}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Receita Total
                            </Typography>
                            <Typography variant="h4">
                                {formatCurrency(mockFinancialData.revenue.totalSales)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Paper>
        </Box>
    );
} 