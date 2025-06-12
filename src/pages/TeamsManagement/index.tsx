import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

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

const TeamsManagement = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [openMemberDialog, setOpenMemberDialog] = useState(false);
    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [cpuTypes, setCpuTypes] = useState<any[]>([]);
    const [newTask, setNewTask] = useState<Partial<TeamTask>>({
        orderId: '',
        cpuType: '',
        components: [],
        priority: 'media',
        status: 'pendente',
        notes: ''
    });

    // Fetch teams data from backend
    useEffect(() => {
        fetchTeams();
        fetchOrders();
        fetchCpuTypes();
    }, []);

    const fetchTeams = async () => {
        try {
            console.log('🔄 Buscando equipes do backend...');
            const response = await axios.get('/api/orders/teams');
            setTeams(response.data);
            console.log('✅ Equipes carregadas:', response.data.length);
        } catch (error) {
            console.error('❌ Erro ao buscar equipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            console.log('🔄 Buscando pedidos...');
            const response = await axios.get('/api/orders');
            setOrders(response.data);
            console.log('✅ Pedidos carregados:', response.data.length);
        } catch (error) {
            console.error('❌ Erro ao buscar pedidos:', error);
            // Dados mock para desenvolvimento
            setOrders([
                { id: 'ORD-001', customerName: 'João Silva', cpuType: 'Gaming Básico', status: 'pendente' },
                { id: 'ORD-002', customerName: 'Maria Santos', cpuType: 'Gaming Avançado', status: 'em_andamento' },
                { id: 'ORD-003', customerName: 'Pedro Costa', cpuType: 'Workstation', status: 'pendente' },
                { id: 'ORD-004', customerName: 'Ana Oliveira', cpuType: 'Office/Corporativo', status: 'pendente' },
                { id: 'ORD-005', customerName: 'Carlos Lima', cpuType: 'Entrada/Budget', status: 'pendente' }
            ]);
        }
    };

    const fetchCpuTypes = async () => {
        try {
            console.log('🔄 Buscando tipos de CPU...');
            const response = await axios.get('/api/orders/cpu-types');
            setCpuTypes(response.data);
            console.log('✅ Tipos de CPU carregados:', response.data.length);
        } catch (error) {
            console.error('❌ Erro ao buscar tipos de CPU:', error);
            // Dados mock para desenvolvimento
            setCpuTypes([
                { id: 'gaming-basic', name: 'Gaming Básico', price: 2500 },
                { id: 'gaming-advanced', name: 'Gaming Avançado', price: 4200 },
                { id: 'workstation', name: 'Workstation', price: 3800 },
                { id: 'office', name: 'Office/Corporativo', price: 1800 },
                { id: 'budget', name: 'Entrada/Budget', price: 1200 }
            ]);
        }
    };

    const handleAddTeam = () => {
        setSelectedTeam(null);
        setOpenDialog(true);
    };

    const handleEditTeam = (team: Team) => {
        setSelectedTeam(team);
        setOpenDialog(true);
    };

    const handleSaveTeam = async (teamData: any) => {
        try {
            if (selectedTeam) {
                // Update existing team
                console.log('🔄 Atualizando equipe:', selectedTeam.id);
                const response = await axios.put(`/api/orders/teams/${selectedTeam.id}`, teamData);
                setTeams(teams.map(team => 
                    team.id === selectedTeam.id ? response.data : team
                ));
                console.log('✅ Equipe atualizada');
            } else {
                // Create new team
                console.log('🔄 Criando nova equipe...');
                const response = await axios.post('/api/orders/teams', teamData);
                setTeams([...teams, response.data]);
                console.log('✅ Nova equipe criada');
            }
            setOpenDialog(false);
        } catch (error) {
            console.error('❌ Erro ao salvar equipe:', error);
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        if (window.confirm('Tem certeza que deseja deletar esta equipe?')) {
            try {
                console.log('🔄 Deletando equipe:', teamId);
                await axios.delete(`/api/orders/teams/${teamId}`);
                setTeams(teams.filter(team => team.id !== teamId));
                console.log('✅ Equipe deletada');
            } catch (error) {
                console.error('❌ Erro ao deletar equipe:', error);
            }
        }
    };

    const handleAddMember = (teamId: string) => {
        setOpenMemberDialog(true);
        setSelectedTeam(teams.find(t => t.id === teamId) || null);
    };

    const handleSaveMember = async (memberData: any) => {
        if (!selectedTeam) return;
        
        try {
            console.log('🔄 Adicionando membro à equipe:', selectedTeam.id);
            const response = await axios.post(`/api/orders/teams/${selectedTeam.id}/members`, memberData);
            
            // Update local state
            setTeams(teams.map(team => 
                team.id === selectedTeam.id 
                    ? { ...team, members: [...team.members, response.data] }
                    : team
            ));
            console.log('✅ Membro adicionado');
            setOpenMemberDialog(false);
        } catch (error) {
            console.error('❌ Erro ao adicionar membro:', error);
        }
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

    // Função para preencher automaticamente os dados da tarefa com base no pedido selecionado
    const handleOrderSelect = async (orderId: string) => {
        try {
            // Encontrar o pedido selecionado nos dados já carregados
            const selectedOrder = orders.find(order => order.id === orderId);
            
            if (selectedOrder) {
                console.log('🔄 Preenchendo dados do pedido:', selectedOrder.id);
                
                // Auto preencher o tipo de CPU
                const newCpuType = selectedOrder.cpuType;
                
                // Auto preencher os componentes com base nas especificações do CPU
                // Verificamos se o pedido tem cpuSpecs, caso contrário deixamos vazio
                const components = selectedOrder.cpuSpecs 
                    ? Object.values(selectedOrder.cpuSpecs).filter(Boolean).map(String)
                    : [];
                
                // Atualizar o estado da nova tarefa
                setNewTask({
                    ...newTask,
                    orderId,
                    cpuType: newCpuType,
                    components,
                    // Mantemos priority, status e notes como estão
                });
                
                console.log('✅ Dados preenchidos automaticamente');
            }
        } catch (error) {
            console.error('❌ Erro ao preencher dados do pedido:', error);
        }
    };

    const handleSaveTask = async () => {
        if (!selectedTeam || !newTask.orderId || !newTask.cpuType) return;

        try {
            console.log('🔄 Adicionando tarefa à equipe:', selectedTeam.id);
            const response = await axios.post(`/api/orders/teams/${selectedTeam.id}/tasks`, newTask);
            
            setTeams(teams.map(team => 
                team.id === selectedTeam.id 
                    ? { ...team, tasks: [...team.tasks, response.data] }
                    : team
            ));
            console.log('✅ Tarefa adicionada');
            setOpenTaskDialog(false);
            setNewTask({});
        } catch (error) {
            console.error('❌ Erro ao adicionar tarefa:', error);
        }
    };

    const handleUpdateTaskStatus = async (teamId: string, taskId: string, newStatus: TeamTask['status']) => {
        try {
            console.log('🔄 Atualizando status da tarefa:', taskId);
            await axios.put(`/api/orders/teams/${teamId}/tasks/${taskId}`, { status: newStatus });
            
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
            console.log('✅ Status da tarefa atualizado');
        } catch (error) {
            console.error('❌ Erro ao atualizar status da tarefa:', error);
        }
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

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <Typography variant="h6">🔄 Carregando equipes...</Typography>
                </Box>
            </Container>
        );
    }

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
                                            onClick={() => handleDeleteTeam(team.id)}
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
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ color: '#2196f3' }}>
                                                {team.activeProjects}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Projetos Ativos
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
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
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#2E7D32' }}>
                                                    {member.name[0]}
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {member.name}
                                                    </Typography>
                                                    <Typography variant="caption" display="block">
                                                        {member.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
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
                        onClick={() => {
                            // This is a simplified version - in real implementation you'd collect form data
                            const formData = {
                                name: '🔧 Nova Equipe',
                                description: 'Descrição da nova equipe',
                                leader: 'Líder da Equipe'
                            };
                            handleSaveTeam(formData);
                        }}
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
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMemberDialog(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1B5E20' } }}
                        onClick={() => {
                            // This is a simplified version - in real implementation you'd collect form data
                            const memberData = {
                                name: 'Novo Membro',
                                role: 'Função do Membro',
                                level: 'pleno',
                                skills: ['Habilidade 1'],
                                email: 'membro@email.com',
                                phone: '(11) 99999-9999'
                            };
                            handleSaveMember(memberData);
                        }}
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
                                <FormControl fullWidth required>
                                    <InputLabel>ID do Pedido</InputLabel>
                                    <Select
                                        value={newTask.orderId}
                                        label="ID do Pedido"
                                        onChange={(e) => {
                                            const orderId = e.target.value as string;
                                            setNewTask({ ...newTask, orderId });
                                            handleOrderSelect(orderId);
                                        }}
                                    >
                                        {Array.isArray(orders) && orders.map((order) => (
                                            <MenuItem key={order.id} value={order.id}>
                                                {order.id} - {order.customerName} ({order.status})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            * Ao selecionar o pedido, tipo de CPU e componentes serão preenchidos automaticamente
                                        </Typography>
                                        {newTask.orderId && (
                                            <Button 
                                                size="small" 
                                                onClick={() => {
                                                    setNewTask({
                                                        ...newTask,
                                                        orderId: '',
                                                        cpuType: '',
                                                        components: []
                                                    });
                                                }}
                                                sx={{ ml: 1 }}
                                            >
                                                Limpar
                                            </Button>
                                        )}
                                    </Box>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Tipo de CPU</InputLabel>
                                    <Select
                                        value={newTask.cpuType}
                                        label="Tipo de CPU"
                                        onChange={(e) => setNewTask({ ...newTask, cpuType: e.target.value })}
                                        disabled={!!newTask.orderId}
                                    >
                                        {Array.isArray(cpuTypes) && cpuTypes.map((cpu) => (
                                            <MenuItem key={cpu.id} value={cpu.id}>
                                                {cpu.name} - R$ {cpu.price?.toLocaleString('pt-BR')}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Componentes"
                                    required
                                    value={newTask.components?.join(', ')}
                                    onChange={(e) => setNewTask({ ...newTask, components: e.target.value.split(',').map(c => c.trim()) })}
                                    disabled={!!newTask.orderId}
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


