import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Build as MaintenanceIcon,
  Work as EmployeeIcon
} from '@mui/icons-material';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'maintenance' | 'employee';
  createdAt: string;
  updatedAt: string;
}

interface UserFormData {
  email: string;
  name: string;
  role: 'admin' | 'maintenance' | 'employee';
  password?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    role: 'employee',
    password: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err: any) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        name: user.name,
        role: user.role,
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        name: '',
        role: 'employee',
        password: ''
      });
    }
    setFormError('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setFormError('');
  };

  const handleFormChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setFormError('');
      const token = localStorage.getItem('token');
      
      // Verificar se o token existe
      if (!token) {
        setFormError('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      console.log('Enviando dados do usuário:', { 
        editingUser: editingUser?.id, 
        formData: { ...formData, password: formData.password ? '***' : '' } 
      });
      
      if (editingUser) {
        // Atualizar usuário existente
        const updateData: any = {
          email: formData.email,
          name: formData.name,
          role: formData.role
        };
        
        if (formData.password && formData.password.trim() !== '') {
          updateData.password = formData.password;
        }

        console.log('Atualizando usuário:', editingUser.id);
        const response = await axios.put(`/api/users/${editingUser.id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Usuário atualizado com sucesso:', response.data);
      } else {
        // Criar novo usuário
        if (!formData.password || formData.password.trim() === '') {
          setFormError('Senha é obrigatória para novos usuários');
          return;
        }

        console.log('Criando novo usuário');
        const response = await axios.post('/api/users', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Usuário criado com sucesso:', response.data);
      }

      handleCloseDialog();
      await fetchUsers(); // Aguardar a atualização da lista
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err);
      console.error('Resposta do servidor:', err.response?.data);
      console.error('Status:', err.response?.status);
      
      if (err.response?.status === 401) {
        setFormError('Sessão expirada. Faça login novamente.');
      } else if (err.response?.status === 403) {
        setFormError('Você não tem permissão para realizar esta ação.');
      } else {
        setFormError(err.response?.data?.message || 'Erro ao salvar usuário. Tente novamente.');
      }
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      console.log('Deletando usuário:', userId);
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Usuário deletado com sucesso');
      
      await fetchUsers(); // Aguardar a atualização da lista
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      console.error('Resposta do servidor:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else if (err.response?.status === 403) {
        setError('Você não tem permissão para realizar esta ação.');
      } else {
        setError(err.response?.data?.message || 'Erro ao excluir usuário. Tente novamente.');
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <AdminIcon sx={{ color: '#f44336' }} />;
      case 'maintenance':
        return <MaintenanceIcon sx={{ color: '#ff9800' }} />;
      case 'employee':
        return <EmployeeIcon sx={{ color: '#4caf50' }} />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'maintenance':
        return 'Manutenção';
      case 'employee':
        return 'Funcionário';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'maintenance':
        return 'warning';
      case 'employee':
        return 'success';
      default:
        return 'default';
    }
  };

  const userStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    maintenance: users.filter(u => u.role === 'maintenance').length,
    employee: users.filter(u => u.role === 'employee').length
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Carregando usuários...</Typography>
      </Box>
    );
  }

  return (
    <Box>
              <Typography variant="h4" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
          👥 Gerenciamento de Usuários
        </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 40, color: '#2E7D32' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userStats.total}
              </Typography>
              <Typography color="textSecondary">
                Total de Usuários
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AdminIcon sx={{ fontSize: 40, color: '#f44336' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userStats.admin}
              </Typography>
              <Typography color="textSecondary">
                Administradores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MaintenanceIcon sx={{ fontSize: 40, color: '#ff9800' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userStats.maintenance}
              </Typography>
              <Typography color="textSecondary">
                Manutenção
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <EmployeeIcon sx={{ fontSize: 40, color: '#4caf50' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userStats.employee}
              </Typography>
              <Typography color="textSecondary">
                Funcionários
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Lista de Usuários
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ backgroundColor: '#2E7D32' }}
          >
            Novo Usuário
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Função</strong></TableCell>
                <TableCell><strong>Criado em</strong></TableCell>
                <TableCell><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getRoleIcon(user.role)}
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenDialog(user)}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog de Criação/Edição */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? '✏️ Editar Usuário' : '➕ Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <TextField
            margin="dense"
            label="Nome Completo"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => handleFormChange('name', e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={(e) => handleFormChange('email', e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Função</InputLabel>
            <Select
              value={formData.role}
              label="Função"
              onChange={(e) => handleFormChange('role', e.target.value)}
            >
              <MenuItem value="admin">👑 Administrador</MenuItem>
              <MenuItem value="maintenance">🔧 Manutenção</MenuItem>
              <MenuItem value="employee">👷 Funcionário</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label={editingUser ? "Nova Senha (deixe vazio para manter atual)" : "Senha"}
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={(e) => handleFormChange('password', e.target.value)}
            required={!editingUser}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: '#2E7D32' }}
          >
            {editingUser ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 
