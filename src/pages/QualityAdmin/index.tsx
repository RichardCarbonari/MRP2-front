import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Skeleton,
    Alert,
    CircularProgress,
    LinearProgress,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface QualityReport {
    id: number;
    productId: string;
    productName: string;
    batchNumber: string;
    defectType: string;
    description: string;
    reportedAt: Date | string;
    reportedBy?: string;
    status: 'pending' | 'reviewing' | 'resolved';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    resolution?: string;
    resolvedAt?: Date | string;
    resolvedBy?: string;
}

interface QualityMetrics {
    totalReports: number;
    pendingReports: number;
    reviewingReports: number;
    resolvedReports: number;
    resolutionRate: number;
    averageResolutionTime: number;
    criticalIssues: number;
    highPriorityIssues: number;
}

export default function QualityAdmin() {
    const [reports, setReports] = useState<QualityReport[]>([]);
    const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<QualityReport | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [resolution, setResolution] = useState('');
    const [filter, setFilter] = useState('all');
    const [submitting, setSubmitting] = useState(false);

    // Carregar dados do backend
    const loadQualityData = async () => {
        try {
            setError(null);
            
            // Obter token de autenticação
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            
            // Carregar relatórios e métricas em paralelo
            const [reportsResponse, metricsResponse] = await Promise.all([
                fetch('/api/orders/quality/reports', { headers }),
                fetch('/api/orders/quality/metrics', { headers })
            ]);

            if (!reportsResponse.ok || !metricsResponse.ok) {
                throw new Error('Erro ao carregar dados de qualidade');
            }

            const reportsData = await reportsResponse.json();
            const metricsData = await metricsResponse.json();

            if (reportsData.success) {
                setReports(reportsData.data);
            }

            if (metricsData.success) {
                setMetrics(metricsData.data);
            }

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Carregar dados iniciais
    useEffect(() => {
        loadQualityData();
    }, []);

    // Função para atualizar dados
    const handleRefresh = () => {
        setRefreshing(true);
        loadQualityData();
    };

    const handleOpenResolution = (report: QualityReport) => {
        setSelectedReport(report);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedReport(null);
        setOpenDialog(false);
        setResolution('');
    };

    const handleSubmitResolution = async () => {
        if (!selectedReport || !resolution.trim()) {
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`/api/orders/quality/reports/${selectedReport.id}/resolve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resolution: resolution.trim(),
                    resolvedBy: 'Administrador do Sistema'
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Atualizar o relatório na lista
                setReports(prevReports => 
                    prevReports.map(report => 
                        report.id === selectedReport.id 
                            ? { ...report, status: 'resolved' as const, resolution: resolution.trim() }
                            : report
                    )
                );
                
                handleCloseDialog();
                // Recarregar métricas
                await loadQualityData();
            } else {
                throw new Error(data.error || 'Erro ao resolver relatório');
            }
        } catch (error) {
            console.error('Erro ao resolver relatório:', error);
            setError('Erro ao resolver relatório. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: QualityReport['status']) => {
        switch (status) {
            case 'pending':
                return '#ff9800';
            case 'reviewing':
                return '#2196f3';
            case 'resolved':
                return '#4caf50';
            default:
                return '#666';
        }
    };

    const getStatusText = (status: QualityReport['status']) => {
        switch (status) {
            case 'pending':
                return 'Pendente';
            case 'reviewing':
                return 'Em Análise';
            case 'resolved':
                return 'Resolvido';
            default:
                return status;
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'critical':
                return '#d32f2f';
            case 'high':
                return '#ff9800';
            case 'medium':
                return '#2196f3';
            case 'low':
                return '#4caf50';
            default:
                return '#666';
        }
    };

    const getPriorityText = (priority?: string) => {
        switch (priority) {
            case 'critical':
                return 'Crítica';
            case 'high':
                return 'Alta';
            case 'medium':
                return 'Média';
            case 'low':
                return 'Baixa';
            default:
                return 'N/A';
        }
    };

    // Filtrar relatórios
    const filteredReports = reports.filter(report => {
        if (filter === 'all') return true;
        return report.status === filter;
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <BugReportIcon sx={{ color: '#2E7D32' }} />
                        Gestão de Qualidade
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                        onClick={handleRefresh}
                        disabled={refreshing}
                        sx={{ borderColor: '#2E7D32', color: '#2E7D32' }}
                    >
                        {refreshing ? 'Atualizando...' : 'Atualizar'}
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {loading && (
                    <LinearProgress sx={{ mb: 3, height: 4, borderRadius: 2 }} />
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total de Problemas
                                </Typography>
                                {loading ? (
                                    <Skeleton variant="text" width={60} height={40} />
                                ) : (
                                    <Typography variant="h4">
                                        {metrics?.totalReports || 0}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Pendentes
                                </Typography>
                                {loading ? (
                                    <Skeleton variant="text" width={60} height={40} />
                                ) : (
                                    <Typography variant="h4" sx={{ color: '#ff9800' }}>
                                        {metrics?.pendingReports || 0}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Taxa de Resolução
                                </Typography>
                                {loading ? (
                                    <Skeleton variant="text" width={60} height={40} />
                                ) : (
                                    <Typography variant="h4" sx={{ color: '#4caf50' }}>
                                        {metrics?.resolutionRate?.toFixed(1) || 0}%
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Críticos
                                </Typography>
                                {loading ? (
                                    <Skeleton variant="text" width={60} height={40} />
                                ) : (
                                    <Typography variant="h4" sx={{ color: '#d32f2f' }}>
                                        {metrics?.criticalIssues || 0}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={3}>
                {/* Lista de Problemas */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">
                                Problemas Reportados
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Filtrar</InputLabel>
                                    <Select
                                        value={filter}
                                        label="Filtrar"
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <MenuItem value="all">Todos</MenuItem>
                                        <MenuItem value="pending">Pendentes</MenuItem>
                                        <MenuItem value="reviewing">Em Análise</MenuItem>
                                        <MenuItem value="resolved">Resolvidos</MenuItem>
                                    </Select>
                                </FormControl>
                                <Tooltip title="Mais Filtros">
                                    <IconButton>
                                        <FilterListIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        <Grid container spacing={2}>
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 3 }).map((_, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Paper sx={{ p: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={8}>
                                                    <Skeleton variant="text" width="60%" height={32} />
                                                    <Skeleton variant="text" width="40%" height={24} />
                                                    <Skeleton variant="text" width="80%" height={20} />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Skeleton variant="rectangular" width={80} height={32} />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                ))
                            ) : filteredReports.length === 0 ? (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="h6" color="textSecondary">
                                            Nenhum relatório encontrado
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {filter === 'all' ? 'Não há relatórios de qualidade disponíveis.' : `Não há relatórios com status "${getStatusText(filter as any)}".`}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ) : (
                                filteredReports.map((report) => (
                                <Grid item xs={12} key={report.id}>
                                    <Paper sx={{ p: 3, border: report.priority === 'critical' ? '2px solid #d32f2f' : 'none' }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={8}>
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Typography variant="h6">
                                                            {report.productName}
                                                        </Typography>
                                                        {report.priority && (
                                                            <Chip 
                                                                label={getPriorityText(report.priority)}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: getPriorityColor(report.priority),
                                                                    color: 'white',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                                        ID: {report.productId} | Lote: {report.batchNumber} | Tipo: {report.defectType}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                                        {report.description}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Reportado por: {report.reportedBy || 'N/A'} em {new Date(report.reportedAt).toLocaleDateString('pt-BR')}
                                                    </Typography>
                                                    {report.resolution && (
                                                        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                Resolução:
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {report.resolution}
                                                            </Typography>
                                                            {report.resolvedBy && (
                                                                <Typography variant="caption" color="textSecondary">
                                                                    Resolvido por: {report.resolvedBy}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                                <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1, alignItems: { xs: 'center', md: 'flex-end' } }}>
                                                    <Chip
                                                        label={getStatusText(report.status)}
                                                        sx={{
                                                            backgroundColor: getStatusColor(report.status),
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                    {report.status !== 'resolved' && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleOpenResolution(report)}
                                                            startIcon={<AssignmentTurnedInIcon />}
                                                            sx={{ 
                                                                backgroundColor: '#2E7D32',
                                                                '&:hover': { backgroundColor: '#1B5E20' }
                                                            }}
                                                        >
                                                            Resolver
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                ))
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialog de Resolução */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Resolver Problema - {selectedReport?.productName}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Resolução"
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            placeholder="Descreva a solução aplicada..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmitResolution}
                        disabled={submitting || !resolution.trim()}
                        startIcon={submitting ? <CircularProgress size={20} /> : <AssignmentTurnedInIcon />}
                        sx={{ 
                            backgroundColor: '#2E7D32',
                            '&:hover': { backgroundColor: '#1B5E20' }
                        }}
                    >
                        {submitting ? 'Processando...' : 'Confirmar Resolução'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 