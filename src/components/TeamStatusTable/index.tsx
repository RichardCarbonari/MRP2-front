import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    LinearProgress,
    Chip,
    Box,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { teamsConfig } from '../../config/teams';

/**
 * Interface que define a estrutura do status de uma equipe
 * @interface TeamStatus
 * @property {string} id - Identificador único da equipe
 * @property {string} currentTask - Tarefa atual sendo executada pela equipe
 * @property {'em_producao' | 'pausado' | 'problema' | 'concluido'} status - Estado atual da equipe
 * @property {number} progress - Porcentagem de conclusão da tarefa atual (0-100)
 * @property {string} lastUpdate - Data e hora da última atualização do status
 */
interface TeamStatus {
    id: string;
    currentTask: string;
    status: 'em_producao' | 'pausado' | 'problema' | 'concluido';
    progress: number;
    lastUpdate: string;
}

// Dados simulados para demonstração
const mockTeamStatus: TeamStatus[] = [
    {
        id: 'quality-components',
        currentTask: 'Inspeção de CPUs Lote #123',
        status: 'em_producao',
        progress: 75,
        lastUpdate: '2024-03-20 10:30'
    },
    {
        id: 'assembly-a',
        currentTask: 'Montagem Gaming PCs #456-460',
        status: 'em_producao',
        progress: 60,
        lastUpdate: '2024-03-20 10:25'
    },
    {
        id: 'assembly-b',
        currentTask: 'Configuração Servidor #789',
        status: 'problema',
        progress: 45,
        lastUpdate: '2024-03-20 10:15'
    },
    {
        id: 'quality-software',
        currentTask: 'Testes Sistema Lote #122',
        status: 'concluido',
        progress: 100,
        lastUpdate: '2024-03-20 10:00'
    },
    {
        id: 'packaging',
        currentTask: 'Empacotamento Lote #121',
        status: 'pausado',
        progress: 80,
        lastUpdate: '2024-03-20 09:45'
    }
];

/**
 * Componente que exibe uma tabela com o status atual de todas as equipes
 * Mostra informações como nome da equipe, tarefa atual, status, progresso e última atualização
 * @component
 */
export default function TeamStatusTable() {
    /**
     * Retorna a cor correspondente ao status da equipe
     * @param {TeamStatus['status']} status - Status atual da equipe
     * @returns {string} Código hexadecimal da cor
     */
    const getStatusColor = (status: TeamStatus['status']) => {
        switch (status) {
            case 'em_producao':
                return '#1DB954';
            case 'pausado':
                return '#ffbb33';
            case 'problema':
                return '#ff4444';
            case 'concluido':
                return '#00C851';
            default:
                return '#666';
        }
    };

    /**
     * Retorna o texto em português correspondente ao status da equipe
     * @param {TeamStatus['status']} status - Status atual da equipe
     * @returns {string} Texto do status em português
     */
    const getStatusText = (status: TeamStatus['status']) => {
        switch (status) {
            case 'em_producao':
                return 'Em Produção';
            case 'pausado':
                return 'Pausado';
            case 'problema':
                return 'Problema';
            case 'concluido':
                return 'Concluído';
            default:
                return status;
        }
    };

    /**
     * Retorna o ícone correspondente ao status da equipe
     * @param {TeamStatus['status']} status - Status atual da equipe
     * @returns {JSX.Element} Componente do ícone do Material-UI
     */
    const getStatusIcon = (status: TeamStatus['status']) => {
        switch (status) {
            case 'em_producao':
                return <InfoIcon />;
            case 'pausado':
                return <WarningIcon />;
            case 'problema':
                return <ErrorIcon />;
            case 'concluido':
                return <CheckCircleIcon />;
            default:
                return <InfoIcon />;
        }
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Equipe</TableCell>
                        <TableCell>Tarefa Atual</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Progresso</TableCell>
                        <TableCell align="center">Última Atualização</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mockTeamStatus.map((team) => (
                        <TableRow key={team.id}>
                            <TableCell>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {teamsConfig[team.id].name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {teamsConfig[team.id].description}
                                </Typography>
                            </TableCell>
                            <TableCell>{team.currentTask}</TableCell>
                            <TableCell align="center">
                                <Chip
                                    icon={getStatusIcon(team.status)}
                                    label={getStatusText(team.status)}
                                    sx={{
                                        backgroundColor: `${getStatusColor(team.status)}15`,
                                        color: getStatusColor(team.status),
                                        fontWeight: 'bold',
                                        '& .MuiChip-icon': {
                                            color: getStatusColor(team.status)
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={team.progress}
                                        sx={{
                                            width: '100%',
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: '#f5f5f5',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: getStatusColor(team.status),
                                                borderRadius: 4
                                            }
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ minWidth: 35 }}>
                                        {team.progress}%
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                {team.lastUpdate}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
} 