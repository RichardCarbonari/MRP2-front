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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BugReportIcon from '@mui/icons-material/BugReport';
import qualityService, { QualityReport } from '../../services/qualityService';

export default function Quality() {
    const [reports, setReports] = useState<QualityReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: '',
        category: '',
        status: 'pending' as const
    });

    // Carregar relatórios do usuário
    const loadReports = async () => {
        try {
            setError(null);
            const data = await qualityService.getAllReports();
            setReports(data);
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
            setError('Erro ao carregar relatórios. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            title: '',
            type: '',
            description: '',
            category: '',
            status: 'pending'
        });
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.type || !formData.description || !formData.category) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        setSubmitting(true);
        try {
            await qualityService.createReport(formData);
            handleCloseDialog();
            loadReports(); // Recarregar lista
        } catch (error) {
            console.error('Erro ao criar relatório:', error);
            setError('Erro ao criar relatório. Tente novamente.');
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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <BugReportIcon sx={{ color: '#2E7D32' }} />
                        Relatórios de Qualidade
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                    >
                        Novo Relatório
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Lista de Relatórios */}
                <Paper sx={{ p: 2 }}>
                    {loading ? (
                        <Box sx={{ p: 2 }}>
                            <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={60} />
                        </Box>
                    ) : (
                        <Box>
                            {reports.map((report) => (
                                <Card key={report.id} sx={{ mb: 2 }}>
                                    <CardContent>
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
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Paper>
            </Box>

            {/* Diálogo de Novo Relatório */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Novo Relatório de Qualidade</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Título"
                            fullWidth
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                value={formData.type}
                                label="Tipo"
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <MenuItem value="hardware">Hardware</MenuItem>
                                <MenuItem value="software">Software</MenuItem>
                                <MenuItem value="integration">Integração</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Categoria"
                            fullWidth
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <TextField
                            label="Descrição"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Enviando...' : 'Enviar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 