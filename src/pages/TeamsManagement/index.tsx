import React, { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    MenuItem,
    Badge,
    Tooltip,
    LinearProgress,
    Divider,
    FormControl,
    InputLabel,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';
import ComputerIcon from '@mui/icons-material/Computer';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    level: 'junior' | 'pleno' | 'senior' | 'lead';
    skills: string[];
    availability: boolean;
    currentProject?: string;
    efficiency: number;
    email: string;
    phone: string;
    joinDate: Date;
}

interface TeamTask {
    id: string;
    orderId: string;
    cpuType: string;
    components: string[];
    priority: 'baixa' | 'media' | 'alta' | 'urgente';
    status: 'pendente' | 'em_andamento' | 'concluida';
    assignedMember?: string;
    estimatedTime: number; // em horas
    notes?: string;
    createdAt: Date;
}

interface Team {
    id: string;
    name: string;
    description: string;
    leader: string;
    members: TeamMember[];
    activeProjects: number;
    efficiency: number;
    completedOrders: number;
    tasks: TeamTask[];
}

const initialTeams: Team[] = [
    {
        id: 'quality-components',
        name: '🔍 Equipe Verificação de Componentes',
        description: 'Responsável pela verificação e controle de qualidade de todos os componentes antes da montagem',
        leader: 'Maria Qualidade',
        activeProjects: 2,
        efficiency: 96,
        completedOrders: 178,
        tasks: [
            {
                id: 'task-1',
                orderId: 'PED001',
                cpuType: 'Gaming Básico',
                components: ['Processador Intel i5', 'Placa-mãe B450', 'RAM 16GB DDR4'],
                priority: 'alta',
                status: 'em_andamento',
                assignedMember: 'Maria Qualidade',
                estimatedTime: 2,
                notes: 'Verificar compatibilidade da placa-mãe',
                createdAt: new Date()
            }
        ],
        members: [
            {
                id: 1,
                name: 'Maria Qualidade',
                role: 'Líder de Qualidade',
                level: 'lead',
                skills: ['Inspeção Visual', 'Testes Funcionais', 'Validação', 'Gestão'],
                availability: true,
                currentProject: 'Verificação lote processadores',
                efficiency: 98,
                email: 'maria.qualidade@email.com',
                phone: '(11) 99876-5432',
                joinDate: new Date('2022-08-15')
            },
            {
                id: 2,
                name: 'Carlos Inspetor',
                role: 'Inspetor de Componentes',
                level: 'senior',
                skills: ['Microscópio Digital', 'Testes Elétricos', 'Controle de Qualidade'],
                availability: false,
                currentProject: 'Inspeção placas-mãe',
                efficiency: 94,
                email: 'carlos.qualidade@email.com',
                phone: '(11) 98765-4321',
                joinDate: new Date('2023-01-20')
            },
            {
                id: 3,
                name: 'Ana Validadora',
                role: 'Técnica de Validação',
                level: 'pleno',
                skills: ['Validação de Specs', 'Testes de Componentes', 'Documentação'],
                availability: true,
                efficiency: 92,
                email: 'ana.qualidade@email.com',
                phone: '(11) 97654-3210',
                joinDate: new Date('2023-04-10')
            }
        ]
    },
    {
        id: 'assembly-a',
        name: '🔧 Equipe Montagem A',
        description: 'Especializada na montagem física das CPUs e realização de testes de hardware',
        leader: 'João Silva',
        activeProjects: 4,
        efficiency: 93,
        completedOrders: 156,
        tasks: [],
        members: [
            {
                id: 4,
                name: 'João Silva',
                role: 'Líder de Montagem',
                level: 'lead',
                skills: ['Montagem Avançada', 'Water Cooling', 'Gestão de Equipe', 'Troubleshooting'],
                availability: true,
                currentProject: 'PED003 - Gaming Avançado',
                efficiency: 96,
                email: 'joao.montagema@email.com',
                phone: '(11) 99876-1234',
                joinDate: new Date('2022-05-10')
            },
            {
                id: 5,
                name: 'Roberto Montador',
                role: 'Montador Sênior',
                level: 'senior',
                skills: ['Montagem de Placas', 'Instalação de Coolers', 'Cable Management'],
                availability: false,
                currentProject: 'PED001 - Gaming Básico',
                efficiency: 91,
                email: 'roberto.montagema@email.com',
                phone: '(11) 98765-2345',
                joinDate: new Date('2023-02-15')
            },
            {
                id: 6,
                name: 'Fernanda Hardware',
                role: 'Montadora Pleno',
                level: 'pleno',
                skills: ['Montagem Básica', 'Testes de Hardware', 'Controle de Qualidade'],
                availability: true,
                efficiency: 89,
                email: 'fernanda.montagema@email.com',
                phone: '(11) 97654-3456',
                joinDate: new Date('2023-06-20')
            }
        ]
    },
    {
        id: 'assembly-b',
        name: '💻 Equipe Montagem B',
        description: 'Responsável pela instalação de sistemas operacionais e testes de software',
        leader: 'Pedro Sistema',
        activeProjects: 3,
        efficiency: 91,
        completedOrders: 142,
        tasks: [],
        members: [
            {
                id: 7,
                name: 'Pedro Sistema',
                role: 'Líder de Software',
                level: 'lead',
                skills: ['Instalação de SO', 'Configuração de Drivers', 'Testes de Software', 'Gestão'],
                availability: true,
                currentProject: 'PED002 - Workstation',
                efficiency: 95,
                email: 'pedro.montagemb@email.com',
                phone: '(11) 99876-7890',
                joinDate: new Date('2022-09-12')
            },
            {
                id: 8,
                name: 'Sofia Software',
                role: 'Especialista em SO',
                level: 'senior',
                skills: ['Windows/Linux', 'Drivers', 'Benchmark de Software', 'Configurações'],
                availability: true,
                efficiency: 93,
                email: 'sofia.montagemb@email.com',
                phone: '(11) 98765-8901',
                joinDate: new Date('2023-01-08')
            },
            {
                id: 9,
                name: 'Lucas Tester',
                role: 'Técnico de Testes',
                level: 'pleno',
                skills: ['Testes de Software', 'Validação de Performance', 'Relatórios'],
                availability: false,
                currentProject: 'Teste lote corporativo',
                efficiency: 87,
                email: 'lucas.montagemb@email.com',
                phone: '(11) 97654-9012',
                joinDate: new Date('2023-07-22')
            }
        ]
    },
    {
        id: 'packaging',
        name: '📦 Equipe Empacotamento',
        description: 'Responsável pelo empacotamento final, etiquetagem e preparação para envio',
        leader: 'Sandra Embalagem',
        activeProjects: 2,
        efficiency: 94,
        completedOrders: 198,
        tasks: [],
        members: [
            {
                id: 10,
                name: 'Sandra Embalagem',
                role: 'Líder de Empacotamento',
                level: 'lead',
                skills: ['Gestão de Embalagem', 'Controle de Qualidade Final', 'Logística'],
                availability: true,
                currentProject: 'Preparação envio lote',
                efficiency: 97,
                email: 'sandra.empacotamento@email.com',
                phone: '(11) 99876-3333',
                joinDate: new Date('2022-11-20')
            },
            {
                id: 11,
                name: 'Carlos Pacote',
                role: 'Especialista em Embalagem',
                level: 'senior',
                skills: ['Embalagem Segura', 'Etiquetagem', 'Controle de Inventário'],
                availability: true,
                efficiency: 92,
                email: 'carlos.empacotamento@email.com',
                phone: '(11) 98765-4444',
                joinDate: new Date('2023-03-15')
            },
            {
                id: 12,
                name: 'Julia Expedição',
                role: 'Auxiliar de Expedição',
                level: 'pleno',
                skills: ['Preparação de Envio', 'Documentação', 'Organização'],
                availability: false,
                currentProject: 'Organização estoque',
                efficiency: 89,
                email: 'julia.empacotamento@email.com',
                phone: '(11) 97654-5555',
                joinDate: new Date('2023-08-05')
            }
        ]
    },
    {
        id: 'maintenance',
        name: '🔧 Equipe Manutenção',
        description: 'Responsável pela manutenção preventiva e corretiva de equipamentos e infraestrutura',
        leader: 'Ricardo Manutenção',
        activeProjects: 1,
        efficiency: 88,
        completedOrders: 89,
        tasks: [],
        members: [
            {
                id: 13,
                name: 'Ricardo Manutenção',
                role: 'Líder de Manutenção',
                level: 'lead',
                skills: ['Manutenção Preventiva', 'Manutenção Corretiva', 'Gestão de Peças', 'Gestão'],
                availability: true,
                efficiency: 94,
                email: 'ricardo.manutencao@email.com',
                phone: '(11) 99876-6666',
                joinDate: new Date('2022-07-08')
            },
            {
                id: 14,
                name: 'Bruno Técnico',
                role: 'Técnico de Manutenção',
                level: 'senior',
                skills: ['Manutenção Elétrica', 'Calibração', 'Diagnóstico de Equipamentos'],
                availability: true,
                efficiency: 86,
                email: 'bruno.manutencao@email.com',
                phone: '(11) 98765-7777',
                joinDate: new Date('2023-02-28')
            },
            {
                id: 15,
                name: 'Marcos Auxiliar',
                role: 'Auxiliar de Manutenção',
                level: 'junior',
                skills: ['Limpeza de Equipamentos', 'Organização de Ferramentas', 'Apoio Técnico'],
                availability: true,
                efficiency: 82,
                email: 'marcos.manutencao@email.com',
                phone: '(11) 97654-8888',
                joinDate: new Date('2023-09-10')
            }
        ]
    }
];

const TeamsManagement = () => {
    const [teams, setTeams] = useState<Team[]>(initialTeams);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [openMemberDialog, setOpenMemberDialog] = useState(false);
    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const [newTask, setNewTask] = useState<Partial<TeamTask>>({
        orderId: '',
        cpuType: '',
        components: [],
        priority: 'media',
        status: 'pendente',
        estimatedTime: 1,
        notes: ''
    });

    const handleAddTeam = () => {
        setSelectedTeam(null);
        setOpenDialog(true);
    };

    const handleEditTeam = (team: Team) => {
        setSelectedTeam(team);
        setOpenDialog(true);
    };

    const handleAddMember = (teamId: string) => {
        setOpenMemberDialog(true);
        setSelectedTeam(teams.find(t => t.id === teamId) || null);
    };

    const handleAddTask = (teamId: string) => {
        setSelectedTeam(teams.find(t => t.id === teamId) || null);
        setNewTask({
            orderId: '',
            cpuType: '',
            components: [],
            priority: 'media',
            status: 'pendente',
            estimatedTime: 1,
            notes: ''
        });
        setOpenTaskDialog(true);
    };

    const handleSaveTask = () => {
        if (!selectedTeam || !newTask.orderId || !newTask.cpuType) return;

        const task: TeamTask = {
            id: `task-${Date.now()}`,
            orderId: newTask.orderId!,
            cpuType: newTask.cpuType!,
            components: newTask.components || [],
            priority: newTask.priority as any,
            status: newTask.status as any,
            estimatedTime: newTask.estimatedTime || 1,
            notes: newTask.notes,
            createdAt: new Date()
        };

        setTeams(teams.map(team => 
            team.id === selectedTeam.id 
                ? { ...team, tasks: [...team.tasks, task] }
                : team
        ));

        setOpenTaskDialog(false);
        setNewTask({});
    };

    const handleUpdateTaskStatus = (teamId: string, taskId: string, newStatus: TeamTask['status']) => {
        setTeams(teams.map(team => 
            team.id === teamId 
                ? {
                    ...team,
                    tasks: team.tasks.map(task => 
                        task.id === taskId ? { ...task, status: newStatus } : task
                    )
                }
                : team
        ));
    };

    const getLevelColor = (level: TeamMember['level']) => {
        switch (level) {
            case 'junior': return '#90caf9';
            case 'pleno': return '#66bb6a';
            case 'senior': return '#ffa726';
            case 'lead': return '#ab47bc';
            default: return '#bdbdbd';
        }
    };

    const getLevelText = (level: TeamMember['level']) => {
        switch (level) {
            case 'junior': return 'Júnior';
            case 'pleno': return 'Pleno';
            case 'senior': return 'Sênior';
            case 'lead': return 'Lead';
            default: return level;
        }
    };

    const getEfficiencyColor = (efficiency: number) => {
        if (efficiency >= 95) return '#4caf50';
        if (efficiency >= 90) return '#8bc34a';
        if (efficiency >= 85) return '#ffeb3b';
        if (efficiency >= 80) return '#ff9800';
        return '#f44336';
    };

    const getPriorityColor = (priority: TeamTask['priority']) => {
        switch (priority) {
            case 'baixa': return '#4caf50';
            case 'media': return '#ff9800';
            case 'alta': return '#f44336';
            case 'urgente': return '#9c27b0';
            default: return '#9e9e9e';
        }
    };

    const getStatusColor = (status: TeamTask['status']) => {
        switch (status) {
            case 'pendente': return '#9e9e9e';
            case 'em_andamento': return '#2196f3';
            case 'concluida': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                    👥 Gestão de Equipes de Produção
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 3 }}>
                    Gerenciamento das 5 equipes especializadas do processo produtivo
                </Typography>

                {/* Dashboard de Métricas das Equipes */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <PeopleIcon sx={{ fontSize: 40, color: '#2E7D32' }} />
                                    <Box>
                                        <Typography color="textSecondary" gutterBottom>
                                            Total de Membros
                                        </Typography>
                                        <Typography variant="h4">
                                            {teams.reduce((acc, team) => acc + team.members.length, 0)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <WorkIcon sx={{ fontSize: 40, color: '#2196f3' }} />
                                    <Box>
                                        <Typography color="textSecondary" gutterBottom>
                                            Projetos Ativos
                                        </Typography>
                                        <Typography variant="h4" sx={{ color: '#2196f3' }}>
                                            {teams.reduce((acc, team) => acc + team.activeProjects, 0)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <AssignmentIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                                    <Box>
                                        <Typography color="textSecondary" gutterBottom>
                                            Pedidos Concluídos
                                        </Typography>
                                        <Typography variant="h4" sx={{ color: '#4caf50' }}>
                                            {teams.reduce((acc, team) => acc + team.completedOrders, 0)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <BuildIcon sx={{ fontSize: 40, color: '#ff9800' }} />
                                    <Box>
                                        <Typography color="textSecondary" gutterBottom>
                                            Eficiência Média
                                        </Typography>
                                        <Typography variant="h4" sx={{ color: '#ff9800' }}>
                                            {Math.round(teams.reduce((acc, team) => acc + team.efficiency, 0) / teams.length)}%
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    🏭 Equipes do Processo Produtivo
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddTeam}
                    sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1B5E20' } }}
                >
                    Nova Equipe
                </Button>
            </Box>

            <Grid container spacing={3}>
                {teams.map((team) => (
                    <Grid item xs={12} lg={6} key={team.id}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {team.name}
                                    </Typography>
                                    <Box>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleEditTeam(team)}
                                            sx={{ color: '#2E7D32' }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Typography color="textSecondary" paragraph sx={{ fontSize: '0.9rem' }}>
                                    {team.description}
                                </Typography>

                                {/* Métricas da Equipe */}
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ color: '#2196f3' }}>
                                                {team.activeProjects}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Projetos Ativos
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ color: getEfficiencyColor(team.efficiency) }}>
                                                {team.efficiency}%
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Eficiência
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ color: '#4caf50' }}>
                                                {team.completedOrders}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Concluídos
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <LinearProgress 
                                    variant="determinate" 
                                    value={team.efficiency} 
                                    sx={{ 
                                        mb: 3, 
                                        height: 8, 
                                        borderRadius: 4,
                                        backgroundColor: '#f0f0f0',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: getEfficiencyColor(team.efficiency)
                                        }
                                    }} 
                                />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                                        👤 Líder da Equipe
                                    </Typography>
                                    <Chip
                                        avatar={<Avatar sx={{ bgcolor: '#2E7D32' }}>{team.leader[0]}</Avatar>}
                                        label={team.leader}
                                        variant="outlined"
                                        sx={{ 
                                            backgroundColor: '#2E7D3210',
                                            borderColor: '#2E7D32'
                                        }}
                                    />
                                </Box>

                                <Typography variant="subtitle2" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                                    👥 Membros da Equipe ({team.members.length})
                                </Typography>
                                <List dense sx={{ minHeight: '240px' }}>
                                    {team.members.map((member) => (
                                        <ListItem key={member.id} sx={{ pl: 0 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: getLevelColor(member.level) }}>
                                                    {member.name[0]}
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {member.name}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                                                        <Chip
                                                            size="small"
                                                            label={getLevelText(member.level)}
                                                            sx={{ 
                                                                backgroundColor: getLevelColor(member.level),
                                                                color: 'white',
                                                                fontSize: '0.7rem',
                                                                height: 20
                                                            }}
                                                        />
                                                        <Typography variant="caption" color="textSecondary">
                                                            {member.role}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" display="block">
                                                        Eficiência: {member.efficiency}% | {member.email}
                                                    </Typography>
                                                    {member.currentProject && (
                                                        <Typography variant="caption" color="textSecondary">
                                                            Projeto: {member.currentProject}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                            <ListItemSecondaryAction>
                                                <Tooltip title={member.availability ? 'Disponível para novos projetos' : 'Ocupado'}>
                                                    <Badge 
                                                        color={member.availability ? 'success' : 'error'} 
                                                        variant="dot"
                                                    >
                                                        <Chip
                                                            size="small"
                                                            label={member.availability ? 'Disponível' : 'Ocupado'}
                                                            color={member.availability ? 'success' : 'default'}
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                    </Badge>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>

                                <Divider sx={{ my: 2 }} />

                                {/* Seção de Tarefas */}
                                <Box sx={{ mb: 2, minHeight: '120px' }}>
                                    <Typography variant="subtitle2" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                                        📋 Tarefas Ativas ({team.tasks.filter(t => t.status !== 'concluida').length})
                                    </Typography>
                                    
                                    {team.tasks.length === 0 ? (
                                        <Alert severity="info" sx={{ fontSize: '0.8rem', minHeight: '48px', display: 'flex', alignItems: 'center' }}>
                                            Nenhuma tarefa atribuída a esta equipe
                                        </Alert>
                                    ) : (
                                        <Box sx={{ maxHeight: 200, overflowY: 'auto', minHeight: '80px' }}>
                                            {team.tasks.map((task) => (
                                                <Card key={task.id} sx={{ mb: 1, backgroundColor: '#f8f9fa' }}>
                                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <ComputerIcon sx={{ fontSize: 16, color: '#2E7D32' }} />
                                                                <Typography variant="body2" fontWeight="bold">
                                                                    {task.orderId} - {task.cpuType}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                <Chip
                                                                    size="small"
                                                                    label={task.priority}
                                                                    sx={{
                                                                        backgroundColor: getPriorityColor(task.priority),
                                                                        color: 'white',
                                                                        fontSize: '0.65rem',
                                                                        height: 20
                                                                    }}
                                                                />
                                                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                                                    <Select
                                                                        value={task.status}
                                                                        onChange={(e) => handleUpdateTaskStatus(team.id, task.id, e.target.value as any)}
                                                                        sx={{ 
                                                                            fontSize: '0.75rem',
                                                                            height: 24,
                                                                            backgroundColor: getStatusColor(task.status),
                                                                            color: 'white',
                                                                            '& .MuiSelect-icon': { color: 'white' }
                                                                        }}
                                                                    >
                                                                        <MenuItem value="pendente">Pendente</MenuItem>
                                                                        <MenuItem value="em_andamento">Em Andamento</MenuItem>
                                                                        <MenuItem value="concluida">Concluída</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </Box>
                                                        
                                                        <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                                                            Componentes: {task.components.join(', ')}
                                                        </Typography>
                                                        
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="caption" color="textSecondary">
                                                                ⏱️ {task.estimatedTime}h estimadas
                                                            </Typography>
                                                            {task.assignedMember && (
                                                                <Typography variant="caption" color="textSecondary">
                                                                    👤 {task.assignedMember}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        
                                                        {task.notes && (
                                                            <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic', mt: 1, display: 'block' }}>
                                                                📝 {task.notes}
                                                            </Typography>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => handleAddMember(team.id)}
                                    sx={{ color: '#2E7D32' }}
                                >
                                    Adicionar Membro
                                </Button>
                                <Button
                                    startIcon={<TaskIcon />}
                                    onClick={() => handleAddTask(team.id)}
                                    sx={{ color: '#2E7D32' }}
                                >
                                    Nova Tarefa
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Diálogo de Nova Equipe */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ backgroundColor: '#2E7D32', color: 'white' }}>
                    {selectedTeam ? 'Editar Equipe' : 'Nova Equipe'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nome da Equipe"
                                    defaultValue={selectedTeam?.name}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descrição"
                                    multiline
                                    rows={3}
                                    defaultValue={selectedTeam?.description}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Líder da Equipe"
                                    defaultValue={selectedTeam?.leader}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1B5E20' } }}
                    >
                        {selectedTeam ? 'Salvar' : 'Criar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de Novo Membro */}
            <Dialog
                open={openMemberDialog}
                onClose={() => setOpenMemberDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ backgroundColor: '#2E7D32', color: 'white' }}>
                    Adicionar Novo Membro
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nome Completo"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    placeholder="nome.equipe@email.com"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Telefone"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Nível</InputLabel>
                                    <Select defaultValue="" label="Nível">
                                        <MenuItem value="junior">Júnior</MenuItem>
                                        <MenuItem value="pleno">Pleno</MenuItem>
                                        <MenuItem value="senior">Sênior</MenuItem>
                                        <MenuItem value="lead">Lead</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Função</InputLabel>
                                    <Select defaultValue="" label="Função">
                                        <MenuItem value="lider">Líder de Equipe</MenuItem>
                                        <MenuItem value="inspetor-componentes">Inspetor de Componentes</MenuItem>
                                        <MenuItem value="tecnico-validacao">Técnico de Validação</MenuItem>
                                        <MenuItem value="montador-senior">Montador Sênior</MenuItem>
                                        <MenuItem value="montador-pleno">Montador Pleno</MenuItem>
                                        <MenuItem value="especialista-so">Especialista em SO</MenuItem>
                                        <MenuItem value="tecnico-testes">Técnico de Testes</MenuItem>
                                        <MenuItem value="especialista-embalagem">Especialista em Embalagem</MenuItem>
                                        <MenuItem value="auxiliar-expedicao">Auxiliar de Expedição</MenuItem>
                                        <MenuItem value="tecnico-manutencao">Técnico de Manutenção</MenuItem>
                                        <MenuItem value="auxiliar-manutencao">Auxiliar de Manutenção</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Habilidades</InputLabel>
                                    <Select
                                        multiple
                                        defaultValue={[]}
                                        label="Habilidades"
                                    >
                                        <MenuItem value="inspecao-visual">Inspeção Visual</MenuItem>
                                        <MenuItem value="testes-funcionais">Testes Funcionais</MenuItem>
                                        <MenuItem value="validacao-specs">Validação de Specs</MenuItem>
                                        <MenuItem value="montagem-avancada">Montagem Avançada</MenuItem>
                                        <MenuItem value="water-cooling">Water Cooling</MenuItem>
                                        <MenuItem value="cable-management">Cable Management</MenuItem>
                                        <MenuItem value="instalacao-so">Instalação de SO</MenuItem>
                                        <MenuItem value="drivers">Configuração de Drivers</MenuItem>
                                        <MenuItem value="benchmark-software">Benchmark de Software</MenuItem>
                                        <MenuItem value="embalagem-segura">Embalagem Segura</MenuItem>
                                        <MenuItem value="etiquetagem">Etiquetagem</MenuItem>
                                        <MenuItem value="manutencao-preventiva">Manutenção Preventiva</MenuItem>
                                        <MenuItem value="manutencao-corretiva">Manutenção Corretiva</MenuItem>
                                        <MenuItem value="gestao">Gestão de Equipe</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select defaultValue="true" label="Status">
                                        <MenuItem value="true">Disponível</MenuItem>
                                        <MenuItem value="false">Ocupado</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Eficiência (%)"
                                    type="number"
                                    defaultValue={85}
                                    inputProps={{ min: 0, max: 100 }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMemberDialog(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1B5E20' } }}
                    >
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de Nova Tarefa */}
            <Dialog
                open={openTaskDialog}
                onClose={() => setOpenTaskDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                                                <DialogTitle sx={{ backgroundColor: '#2E7D32', color: 'white' }}>
                                    Adicionar Nova Tarefa
                                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="ID do Pedido"
                                    required
                                    value={newTask.orderId}
                                    onChange={(e) => setNewTask({ ...newTask, orderId: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tipo de CPU"
                                    required
                                    value={newTask.cpuType}
                                    onChange={(e) => setNewTask({ ...newTask, cpuType: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Componentes"
                                    required
                                    value={newTask.components?.join(', ')}
                                    onChange={(e) => setNewTask({ ...newTask, components: e.target.value.split(',').map(c => c.trim()) })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Prioridade</InputLabel>
                                    <Select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                                    >
                                        <MenuItem value="baixa">Baixa</MenuItem>
                                        <MenuItem value="media">Média</MenuItem>
                                        <MenuItem value="alta">Alta</MenuItem>
                                        <MenuItem value="urgente">Urgente</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={newTask.status}
                                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                                    >
                                        <MenuItem value="pendente">Pendente</MenuItem>
                                        <MenuItem value="em_andamento">Em Andamento</MenuItem>
                                        <MenuItem value="concluida">Concluída</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tempo Estimado (horas)"
                                    type="number"
                                    required
                                    value={newTask.estimatedTime}
                                    onChange={(e) => setNewTask({ ...newTask, estimatedTime: Number(e.target.value) })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Notas"
                                    multiline
                                    rows={3}
                                    value={newTask.notes}
                                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTaskDialog(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1B5E20' } }}
                        onClick={handleSaveTask}
                    >
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TeamsManagement;


