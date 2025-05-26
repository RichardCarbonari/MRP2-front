import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Tooltip,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
} from '@mui/lab';
import {
    Speed as SpeedIcon,
    Error as ErrorIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    TrendingFlat as TrendingFlatIcon,
    Person as PersonIcon,
    Build as BuildIcon
} from '@mui/icons-material';
import { CapacidadeRecurso } from '../../hooks/useProductiveCapacity';

interface HistoricoEvento {
    id: number;
    timestamp: Date;
    tipo: 'erro' | 'alerta' | 'sucesso';
    mensagem: string;
}

interface MembroEquipe {
    id: number;
    nome: string;
    funcao: string;
    disponivel: boolean;
    ultimaAtividade?: string;
}

interface TeamDetailsProps {
    recurso: CapacidadeRecurso;
    formatarData: (data: Date) => string;
}

// Dados simulados para demonstração
const membrosSimulados: MembroEquipe[] = [
    { id: 1, nome: 'João Silva', funcao: 'Líder Técnico', disponivel: true },
    { id: 2, nome: 'Maria Santos', funcao: 'Técnica Senior', disponivel: true },
    { id: 3, nome: 'Pedro Oliveira', funcao: 'Técnico', disponivel: false, ultimaAtividade: 'Em pausa' },
    { id: 4, nome: 'Ana Costa', funcao: 'Técnica', disponivel: true }
];

const historicoSimulado: HistoricoEvento[] = [
    { 
        id: 1, 
        timestamp: new Date(Date.now() - 1800000),
        tipo: 'erro',
        mensagem: 'Falha no teste de componente CPU#123'
    },
    {
        id: 2,
        timestamp: new Date(Date.now() - 3600000),
        tipo: 'sucesso',
        mensagem: 'Lote CPU#120-125 aprovado com sucesso'
    },
    {
        id: 3,
        timestamp: new Date(Date.now() - 7200000),
        tipo: 'alerta',
        mensagem: 'Capacidade próxima do limite'
    }
];

const getCorStatus = (status: 'normal' | 'atencao' | 'critico') => {
    switch (status) {
        case 'normal':
            return '#1DB954';
        case 'atencao':
            return '#f39c12';
        case 'critico':
            return '#e74c3c';
        default:
            return '#666';
    }
};

const getTendenciaIcon = (tendencia?: 'subindo' | 'descendo' | 'estavel') => {
    switch (tendencia) {
        case 'subindo':
            return <TrendingUpIcon sx={{ color: '#e74c3c' }} />;
        case 'descendo':
            return <TrendingDownIcon sx={{ color: '#1DB954' }} />;
        case 'estavel':
            return <TrendingFlatIcon sx={{ color: '#f39c12' }} />;
        default:
            return null;
    }
};

export default function TeamDetails({ recurso, formatarData }: TeamDetailsProps) {
    return (
        <Box sx={{ p: 3 }}>
            {/* Cabeçalho */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {recurso.nome}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Última atualização: {formatarData(recurso.ultimaAtualizacao)}
                </Typography>
            </Box>

            {/* Métricas Principais */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SpeedIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Capacidade Atual</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Tooltip title={`${recurso.emUso}% da capacidade em uso`}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={recurso.emUso}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                bgcolor: '#e9ecef',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: getCorStatus(recurso.status)
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {recurso.emUso}%
                                </Typography>
                                {getTendenciaIcon(recurso.tendencia)}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <BuildIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">CPUs em Processo</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ color: '#1DB954' }}>
                                {recurso.cpusEmProcessamento} / {recurso.capacidadeDiaria}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Capacidade diária
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ScheduleIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Tempo por Unidade</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ color: '#1DB954' }}>
                                {recurso.tempoPorUnidade}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Minutos por CPU
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PersonIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Equipe</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ color: '#1DB954' }}>
                                {membrosSimulados.length}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {membrosSimulados.filter(m => m.disponivel).length} disponíveis
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Membros da Equipe e Histórico */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Membros da Equipe
                        </Typography>
                        <List>
                            {membrosSimulados.map((membro) => (
                                <ListItem key={membro.id}>
                                    <ListItemIcon>
                                        <PersonIcon sx={{ color: membro.disponivel ? '#1DB954' : '#666' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={membro.nome}
                                        secondary={
                                            <>
                                                {membro.funcao}
                                                {!membro.disponivel && ` • ${membro.ultimaAtividade}`}
                                            </>
                                        }
                                    />
                                    <Chip
                                        label={membro.disponivel ? 'Disponível' : 'Indisponível'}
                                        sx={{
                                            bgcolor: membro.disponivel ? '#1DB954' : '#666',
                                            color: 'white'
                                        }}
                                        size="small"
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Histórico de Eventos
                        </Typography>
                        <Timeline>
                            {historicoSimulado.map((evento) => (
                                <TimelineItem key={evento.id}>
                                    <TimelineSeparator>
                                        <TimelineDot sx={{
                                            bgcolor: evento.tipo === 'erro' ? '#e74c3c' :
                                                    evento.tipo === 'alerta' ? '#f39c12' : '#1DB954'
                                        }}>
                                            {evento.tipo === 'erro' ? <ErrorIcon /> :
                                             evento.tipo === 'alerta' ? <WarningIcon /> :
                                             <CheckCircleIcon />}
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Typography variant="body1">
                                            {evento.mensagem}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {formatarData(evento.timestamp)}
                                        </Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
} 