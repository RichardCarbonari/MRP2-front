import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Zoom,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Build,
  Inventory,
  Person,
  Badge,
  BusinessCenter,
  Schedule,
  Assignment
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface Material {
  name: string;
  quantity: number;
  unit: string;
}

interface Tool {
  name: string;
  quantity: number;
}

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  team: string;
  shift: string;
  materials: Material[];
  tools: Tool[];
}

const Employee = () => {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const userEmail = user?.email || '';
      
      // Buscar perfil do funcionário
      const profileResponse = await fetch(`http://localhost:3006/api/employees/profile/${encodeURIComponent(userEmail)}`);
      if (!profileResponse.ok) {
        throw new Error('Erro ao buscar perfil do funcionário');
      }
      const profile = await profileResponse.json();
      
      // Buscar materiais do departamento
      const materialsResponse = await fetch(`http://localhost:3006/api/employees/materials/${encodeURIComponent(profile.department)}`);
      if (!materialsResponse.ok) {
        throw new Error('Erro ao buscar materiais');
      }
      const materials = await materialsResponse.json();
      
      // Buscar ferramentas do departamento
      const toolsResponse = await fetch(`http://localhost:3006/api/employees/tools/${encodeURIComponent(profile.department)}`);
      if (!toolsResponse.ok) {
        throw new Error('Erro ao buscar ferramentas');
      }
      const tools = await toolsResponse.json();
      
      setEmployeeData({
        ...profile,
        materials,
        tools
      });
    } catch (error) {
      console.error('Error loading employee data:', error);
      // Fallback para dados simulados se o backend não estiver disponível
      const mockData: EmployeeData = {
        id: user?.id || '1',
        name: user?.name || 'Funcionário',
        email: user?.email || '',
        department: getUserDepartment(user?.email || ''),
        role: getUserRole(user?.email || ''),
        team: getUserTeam(user?.email || ''),
        shift: 'Manhã (07:00 - 15:00)',
        materials: getMaterialsByDepartment(getUserDepartment(user?.email || '')),
        tools: getToolsByDepartment(getUserDepartment(user?.email || ''))
      };
      setEmployeeData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getUserDepartment = (email: string): string => {
    const emailToDepartment = {
      'maria.substrato@mrp2cpu.com.br': 'Substrato PCB',
      'ana.bonding@mrp2cpu.com.br': 'Montagem SMT',
      'patricia.encaps@mrp2cpu.com.br': 'Soldagem',
      'fernanda.teste@mrp2cpu.com.br': 'Testes',
      'juliana.embalagem@mrp2cpu.com.br': 'Embalagem'
    };
    return emailToDepartment[email as keyof typeof emailToDepartment] || 'Substrato PCB';
  };

  const getUserRole = (email: string): string => {
    const emailToRole = {
      'maria.substrato@mrp2cpu.com.br': 'Técnica de Substrato PCB',
      'ana.bonding@mrp2cpu.com.br': 'Operadora SMT',
      'patricia.encaps@mrp2cpu.com.br': 'Técnica de Soldagem',
      'fernanda.teste@mrp2cpu.com.br': 'Especialista em Testes de CPU',
      'juliana.embalagem@mrp2cpu.com.br': 'Operadora de Embalagem ESD'
    };
    return emailToRole[email as keyof typeof emailToRole] || 'Operador de Substrato';
  };

  const getUserTeam = (email: string): string => {
    const emailToTeam = {
      'maria.substrato@mrp2cpu.com.br': 'Equipe Substrato A',
      'ana.bonding@mrp2cpu.com.br': 'Equipe SMT B',
      'patricia.encaps@mrp2cpu.com.br': 'Equipe Soldagem A',
      'fernanda.teste@mrp2cpu.com.br': 'Equipe Testes Funcionais',
      'juliana.embalagem@mrp2cpu.com.br': 'Equipe Embalagem ESD'
    };
    return emailToTeam[email as keyof typeof emailToTeam] || 'Equipe Substrato A';
  };

  const getMaterialsByDepartment = (department: string): Material[] => {
    const materialsByDept = {
      'Produção': [
        { name: 'Substrato Cerâmico', quantity: 100, unit: 'peças' },
        { name: 'Pasta Condutiva', quantity: 5, unit: 'tubos' },
        { name: 'Fios de Ouro', quantity: 50, unit: 'metros' }
      ],
      'Usinagem': [
        { name: 'Barra de Aço Inox', quantity: 10, unit: 'peças' },
        { name: 'Fluido de Corte', quantity: 2, unit: 'litros' },
        { name: 'Insertos de Carbeto', quantity: 20, unit: 'peças' }
      ],
      'Estamparia': [
        { name: 'Chapa de Aço 2mm', quantity: 15, unit: 'folhas' },
        { name: 'Óleo Hidráulico', quantity: 3, unit: 'litros' },
        { name: 'Punção M4', quantity: 5, unit: 'peças' }
      ],
      'Montagem': [
        { name: 'Parafusos M3', quantity: 200, unit: 'peças' },
        { name: 'Eletrodo de Solda', quantity: 10, unit: 'peças' },
        { name: 'Fita Isolante', quantity: 5, unit: 'rolos' }
      ],
      'Embalagem': [
        { name: 'Caixas de Papelão', quantity: 50, unit: 'peças' },
        { name: 'Filme Plástico', quantity: 3, unit: 'rolos' },
        { name: 'Etiquetas', quantity: 200, unit: 'peças' }
      ]
    };
    return materialsByDept[department as keyof typeof materialsByDept] || materialsByDept['Produção'];
  };

  const getToolsByDepartment = (department: string): Tool[] => {
    const toolsByDept = {
      'Produção': [
        { name: 'Microscópio de Inspeção', quantity: 1 },
        { name: 'Alicate de Precisão', quantity: 2 },
        { name: 'Multímetro Digital', quantity: 1 }
      ],
      'Usinagem': [
        { name: 'Micrômetro 0-25mm', quantity: 1 },
        { name: 'Relógio Comparador', quantity: 1 },
        { name: 'Chaves Hexagonais', quantity: 1 }
      ],
      'Estamparia': [
        { name: 'Paquímetro 150mm', quantity: 1 },
        { name: 'Martelo de Borracha', quantity: 1 },
        { name: 'Lima Plana', quantity: 2 }
      ],
      'Montagem': [
        { name: 'Chave Philips', quantity: 2 },
        { name: 'Alicate Desencapador', quantity: 1 },
        { name: 'Soprador Térmico', quantity: 1 }
      ],
      'Embalagem': [
        { name: 'Pistola de Cola Quente', quantity: 1 },
        { name: 'Estilete Profissional', quantity: 2 },
        { name: 'Fita Métrica', quantity: 1 }
      ]
    };
    return toolsByDept[department as keyof typeof toolsByDept] || toolsByDept['Produção'];
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} sx={{ color: '#1DB954' }} />
        </Box>
      </Container>
    );
  }

  if (!employeeData) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography variant="h6" color="text.secondary">
            Erro ao carregar dados do funcionário
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{
                color: '#1DB954',
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '25%',
                  width: '50%',
                  height: 4,
                  backgroundColor: '#1DB954',
                  borderRadius: 2
                }
              }}
            >
              Perfil do Funcionário
            </Typography>
          </Box>

          {/* Employee Profile */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: '#1DB954',
                          fontSize: '2rem',
                          mr: 3
                        }}
                      >
                        {employeeData.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ color: '#1DB954', fontWeight: 'bold', mb: 1 }}>
                          {employeeData.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          {employeeData.email}
                        </Typography>
                        <Chip 
                          label={employeeData.role}
                          sx={{ 
                            backgroundColor: 'rgba(29, 185, 84, 0.1)',
                            color: '#1DB954',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <BusinessCenter sx={{ color: '#666', mr: 1 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Departamento
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {employeeData.department}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Badge sx={{ color: '#666', mr: 1 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Equipe
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {employeeData.team}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Schedule sx={{ color: '#666', mr: 1 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Turno
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {employeeData.shift}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Assignment sx={{ color: '#666', mr: 1 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Função
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {employeeData.role}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>

          {/* Materials and Tools */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                <Paper sx={{ 
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  height: '100%',
                }}>
                  <Typography variant="h6" gutterBottom sx={{
                    color: '#1DB954',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                    '&::before': {
                      content: '""',
                      width: 4,
                      height: 24,
                      backgroundColor: '#1DB954',
                      borderRadius: 2
                    }
                  }}>
                    <Inventory />
                    Materiais do Departamento
                  </Typography>
                  <List>
                    {employeeData.materials.map((material, index) => (
                      <ListItem 
                        key={index}
                        sx={{
                          transition: 'background-color 0.2s',
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(29, 185, 84, 0.05)',
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Inventory sx={{ color: '#1DB954' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={material.name}
                          secondary={
                            <Chip 
                              label={`${material.quantity} ${material.unit}`}
                              size="small"
                              sx={{ 
                                backgroundColor: 'rgba(29, 185, 84, 0.1)',
                                color: '#1DB954',
                                fontWeight: 'bold',
                                mt: 0.5
                              }}
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                <Paper sx={{ 
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  height: '100%',
                }}>
                  <Typography variant="h6" gutterBottom sx={{
                    color: '#1DB954',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                    '&::before': {
                      content: '""',
                      width: 4,
                      height: 24,
                      backgroundColor: '#1DB954',
                      borderRadius: 2
                    }
                  }}>
                    <Build />
                    Ferramentas do Departamento
                  </Typography>
                  <List>
                    {employeeData.tools.map((tool, index) => (
                      <ListItem 
                        key={index}
                        sx={{
                          transition: 'background-color 0.2s',
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(29, 185, 84, 0.05)',
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Build sx={{ color: '#1DB954' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={tool.name}
                          secondary={
                            <Chip 
                              label={`Quantidade: ${tool.quantity}`}
                              size="small"
                              sx={{ 
                                backgroundColor: 'rgba(29, 185, 84, 0.1)',
                                color: '#1DB954',
                                fontWeight: 'bold',
                                mt: 0.5
                              }}
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Fade>
  );
};

export default Employee; 