import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import ptBR from 'date-fns/locale/pt-BR';
import qualityService, { QualityReport } from '../../services/qualityService';

export default function QualityRegister() {
    const [reports, setReports] = useState<QualityReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [newReport, setNewReport] = useState({
        title: '',
        type: '',
        description: '',
        category: '',
        status: 'pending' as const
    });

    // Carregar relatórios
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError(null);
            await qualityService.createReport(newReport);
            setNewReport({
                title: '',
                type: '',
                description: '',
                category: '',
                status: 'pending'
            });
            setOpenSnackbar(true);
            loadReports(); // Recarregar lista
        } catch (error) {
            console.error('Erro ao criar relatório:', error);
            setError('Erro ao criar relatório. Tente novamente.');
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
            <Typography variant="h4" gutterBottom>
                Registro de Qualidade
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Formulário de Registro */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Novo Registro
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Título"
                                        value={newReport.title}
                                        onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Tipo</InputLabel>
                                        <Select
                                            value={newReport.type}
                                            label="Tipo"
                                            onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                                        >
                                            <MenuItem value="hardware">Hardware</MenuItem>
                                            <MenuItem value="software">Software</MenuItem>
                                            <MenuItem value="integration">Integração</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Categoria"
                                        value={newReport.category}
                                        onChange={(e) => setNewReport({...newReport, category: e.target.value})}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Descrição do Problema"
                                        value={newReport.description}
                                        onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        sx={{ 
                                            mt: 2,
                                            backgroundColor: '#1DB954',
                                            '&:hover': { backgroundColor: '#18a449' }
                                        }}
                                    >
                                        Registrar Problema
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Lista de Registros */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Registros Recentes
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {reports.map((report) => (
                                <Card key={report.id} sx={{ mb: 2 }}>
                                    <CardContent>
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
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message="Relatório registrado com sucesso!"
            />
        </Container>
    );
} 