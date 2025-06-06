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
        ]
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
                                    sx={{ color: '#1DB954' }}
                                >
                                    Adicionar Membro
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
                <DialogTitle>
                    {selectedTeam ? 'Editar Equipe' : 'Nova Equipe'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nome da Equipe"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descrição"
                                    multiline
                                    rows={3}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Líder da Equipe"
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
                        sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#18a449' } }}
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
                <DialogTitle>
                    Adicionar Novo Membro
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nome do Membro"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Função"
                                    required
                                    defaultValue=""
                                >
                                    <MenuItem value="tecnico">Técnico de Manutenção</MenuItem>
                                    <MenuItem value="especialista">Especialista em Manutenção</MenuItem>
                                    <MenuItem value="supervisor">Supervisor de Manutenção</MenuItem>
                                    <MenuItem value="auxiliar">Auxiliar de Manutenção</MenuItem>
                                    <MenuItem value="operador">Operador</MenuItem>
                                    <MenuItem value="qualidade">Analista de Qualidade</MenuItem>
                                    <MenuItem value="montador">Montador</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Habilidades"
                                    SelectProps={{
                                        multiple: true
                                    }}
                                    defaultValue={[]}
                                >
                                    <MenuItem value="manutencao_preventiva">Manutenção Preventiva</MenuItem>
                                    <MenuItem value="manutencao_corretiva">Manutenção Corretiva</MenuItem>
                                    <MenuItem value="eletrica">Manutenção Elétrica</MenuItem>
                                    <MenuItem value="mecanica">Manutenção Mecânica</MenuItem>
                                    <MenuItem value="hidraulica">Manutenção Hidráulica</MenuItem>
                                    <MenuItem value="automacao">Automação</MenuItem>
                                    <MenuItem value="soldagem">Soldagem</MenuItem>
                                    <MenuItem value="montagem">Montagem</MenuItem>
                                    <MenuItem value="qualidade">Controle de Qualidade</MenuItem>
                                    <MenuItem value="gestao">Gestão de Equipe</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Disponibilidade"
                                    required
                                    defaultValue="true"
                                >
                                    <MenuItem value="true">Disponível</MenuItem>
                                    <MenuItem value="false">Ocupado</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMemberDialog(false)}>Cancelar</Button>
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