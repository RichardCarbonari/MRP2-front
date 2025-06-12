import React, { useState, useEffect, useCallback } from 'react';
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
    TableCell,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import qualityService, { QualityReport, QualityMetrics } from '../../services/qualityService';

interface QualityReport {
  id: string;
  title: string;
  type: string;
  description: string;
  category: string;
  status: string;
  notes?: string;
  resolution?: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
  timeRemaining?: string;
  user: {
    name: string;
    email: string;
  };
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
    const [timers, setTimers] = useState<{ [key: string]: string }>({});

    // Carregar dados do backend
    const loadQualityData = async () => {
        try {
            setError(null);
            
            // Carregar relatórios e métricas em paralelo
            const [reportsData, metricsData] = await Promise.all([
                qualityService.getAllReports(),
                qualityService.getMetrics()
            ]);

            setReports(reportsData);
            setMetrics(metricsData);

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
            const updatedReport = await qualityService.updateReport(selectedReport.id, {
                status: 'resolved',
                resolution: resolution.trim()
            });

            // Atualizar o relatório na lista
            setReports(prevReports => 
                prevReports.map(report => 
                    report.id === selectedReport.id ? updatedReport : report
                )
            );
            
            handleCloseDialog();
            // Recarregar métricas
            await loadQualityData();
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
            case 'in_progress':
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
            case 'in_progress':
                return 'Em Análise';
            case 'resolved':
                return 'Resolvido';
            default:
                return status;
        }
    };

    // Filtrar relatórios
    const filteredReports = reports.filter(report => {
        if (filter === 'all') return true;
        return report.status === filter;
    });

    // Função para atualizar os timers
    const updateTimers = useCallback(() => {
        setTimers(prev => {
            const newTimers = { ...prev };
            reports.forEach(report => {
                if (report.status === 'resolved' && report.timeRemaining) {
                    newTimers[report.id] = report.timeRemaining;
                }
            });
            return newTimers;
        });
    }, [reports]);

    // Atualizar timers a cada segundo
    useEffect(() => {
        const interval = setInterval(updateTimers, 1000);
        return () => clearInterval(interval);
    }, [updateTimers]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <BugReportIcon sx={{ color: '#2E7D32' }} />
                        Gestão de Qualidade
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            {refreshing ? 'Atualizando...' : 'Atualizar'}
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Métricas */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {metrics ? (
                        <>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Total de Relatórios
                                        </Typography>
                                        <Typography variant="h4">
                                            {metrics.overview.totalReports}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Pendentes
                                        </Typography>
                                        <Typography variant="h4">
                                            {metrics.overview.pendingReports}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Resolvidos
                                        </Typography>
                                        <Typography variant="h4">
                                            {metrics.overview.resolvedReports}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Taxa de Resolução
                                        </Typography>
                                        <Typography variant="h4">
                                            {metrics.overview.resolutionRate.toFixed(1)}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                    ) : (
                        <Grid item xs={12}>
                            <Skeleton variant="rectangular" height={118} />
                        </Grid>
                    )}
                </Grid>

                {/* Lista de Relatórios */}
                <Paper sx={{ p: 2 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Relatórios de Qualidade
                        </Typography>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Filtrar</InputLabel>
                            <Select
                                value={filter}
                                label="Filtrar"
                                onChange={(e) => setFilter(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="all">Todos</MenuItem>
                                <MenuItem value="pending">Pendentes</MenuItem>
                                <MenuItem value="in_progress">Em Análise</MenuItem>
                                <MenuItem value="resolved">Resolvidos</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {loading ? (
                        <Box sx={{ p: 2 }}>
                            <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={60} />
                        </Box>
                    ) : (
                        <Box>
                            {filteredReports.map((report) => (
                                <Card key={report.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    {report.title}
                                                </Typography>
                                                <Typography color="textSecondary" gutterBottom>
                                                    {report.description}
                                                </Typography>
                                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                    <Chip
                                                        label={getStatusText(report.status)}
                                                        sx={{
                                                            backgroundColor: getStatusColor(report.status),
                                                            color: 'white'
                                                        }}
                                                        size="small"
                                                    />
                                                    <Chip
                                                        label={report.type}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                    <Chip
                                                        label={report.category}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </Box>
                                            </Box>
                                            {report.status !== 'resolved' && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleOpenResolution(report)}
                                                >
                                                    Resolver
                                                </Button>
                                            )}
                                        </Box>
                                        {report.resolution && (
                                            <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    Resolução:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {report.resolution}
                                                </Typography>
                                            </Box>
                                        )}
                                        {report.status === 'resolved' && timers[report.id] && (
                                            <TableCell>
                                                <Tooltip title="Tempo restante até deleção automática">
                                                    <Chip
                                                        size="small"
                                                        label={timers[report.id]}
                                                        color="warning"
                                                        variant="outlined"
                                                        sx={{ 
                                                            fontSize: '0.75rem',
                                                            opacity: 0.7,
                                                            '&:hover': { opacity: 1 }
                                                        }}
                                                    />
                                                </Tooltip>
                                            </TableCell>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Paper>
            </Box>

            {/* Diálogo de Resolução */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Resolver Relatório</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Resolução"
                        fullWidth
                        multiline
                        rows={4}
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmitResolution}
                        variant="contained"
                        color="primary"
                        disabled={!resolution.trim() || submitting}
                    >
                        {submitting ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 