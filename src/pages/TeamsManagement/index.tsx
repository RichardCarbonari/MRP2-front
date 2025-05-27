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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { teamsConfig } from '../../config/teams';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    skills: string[];
    availability: boolean;
}

interface Team {
    id: string;
    name: string;
    description: string;
    leader: string;
    members: TeamMember[];
    performance: {
        efficiency: number;
        quality: number;
        productivity: number;
    };
}

export default function TeamsManagement() {
    const [teams, setTeams] = useState<Team[]>(Object.entries(teamsConfig).map(([id, team]) => ({
        id,
        name: team.name,
        description: team.description,
        leader: 'João Silva', // Exemplo
        members: [
            {
                id: 1,
                name: 'João Silva',
                role: 'Líder',
                skills: ['Montagem', 'Teste', 'Gestão'],
                availability: true
            },
            // Outros membros seriam carregados do backend
        ],
        performance: {
            efficiency: 85,
            quality: 92,
            productivity: 88
        }
    })));

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [openMemberDialog, setOpenMemberDialog] = useState(false);

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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Gestão de Equipes
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddTeam}
                    sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#18a449' } }}
                >
                    Nova Equipe
                </Button>
            </Box>

            <Grid container spacing={3}>
                {teams.map((team) => (
                    <Grid item xs={12} md={6} key={team.id}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <Typography variant="h6" gutterBottom>
                                        {team.name}
                                    </Typography>
                                    <Box>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleEditTeam(team)}
                                            sx={{ color: '#1DB954' }}
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

                                <Typography color="textSecondary" paragraph>
                                    {team.description}
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Líder da Equipe
                                    </Typography>
                                    <Chip
                                        avatar={<Avatar>{team.leader[0]}</Avatar>}
                                        label={team.leader}
                                        variant="outlined"
                                        sx={{ backgroundColor: '#1DB95410' }}
                                    />
                                </Box>

                                <Typography variant="subtitle2" gutterBottom>
                                    Performance
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" display="block">
                                            Eficiência
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            {team.performance.efficiency}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" display="block">
                                            Qualidade
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            {team.performance.quality}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" display="block">
                                            Produtividade
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            {team.performance.productivity}%
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Typography variant="subtitle2" gutterBottom>
                                    Membros da Equipe
                                </Typography>
                                <List dense>
                                    {team.members.map((member) => (
                                        <ListItem key={member.id}>
                                            <ListItemText
                                                primary={member.name}
                                                secondary={member.role}
                                            />
                                            <ListItemSecondaryAction>
                                                <Chip
                                                    size="small"
                                                    label={member.availability ? 'Disponível' : 'Ocupado'}
                                                    color={member.availability ? 'success' : 'default'}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => handleAddMember(team.id)}
                                    size="small"
                                    sx={{ color: '#1DB954' }}
                                >
                                    Adicionar Membro
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog para adicionar/editar equipe */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedTeam ? 'Editar Equipe' : 'Nova Equipe'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Nome da Equipe"
                            defaultValue={selectedTeam?.name}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Descrição"
                            multiline
                            rows={3}
                            defaultValue={selectedTeam?.description}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Líder da Equipe"
                            defaultValue={selectedTeam?.leader}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained"
                        sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#18a449' } }}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para adicionar membro */}
            <Dialog open={openMemberDialog} onClose={() => setOpenMemberDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Adicionar Membro à Equipe
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Nome do Funcionário"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Função"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Habilidades"
                            helperText="Separe as habilidades por vírgula"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMemberDialog(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained"
                        sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#18a449' } }}
                    >
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 