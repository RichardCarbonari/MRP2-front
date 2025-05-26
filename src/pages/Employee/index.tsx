import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  RestaurantMenu,
  Error,
  CheckCircle,
  Build,
  Inventory,
} from '@mui/icons-material';
import TimerComponent from '../../components/TimerComponent';

type TaskStatus = 'not_started' | 'in_progress' | 'break' | 'lunch' | 'problem' | 'completed';

interface Material {
  name: string;
  quantity: number;
  unit: string;
}

interface Tool {
  name: string;
  quantity: number;
}

const Employee = () => {
  const [status, setStatus] = useState<TaskStatus>('not_started');
  const [startTime, setStartTime] = useState<Date | undefined>();

  // Mock data - replace with real data from your backend
  const taskData = {
    id: '1',
    name: 'Montagem do Produto XYZ',
    estimatedTime: 120, // 2 hours in minutes
    materials: [
      { name: 'Parafuso M4', quantity: 12, unit: 'unidades' },
      { name: 'Placa de Metal', quantity: 2, unit: 'peças' },
    ] as Material[],
    tools: [
      { name: 'Chave de Fenda', quantity: 1 },
      { name: 'Alicate', quantity: 1 },
    ] as Tool[],
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
    if (newStatus === 'in_progress' && !startTime) {
      setStartTime(new Date());
    }
  };

  const getStatusButton = (buttonStatus: TaskStatus, icon: JSX.Element, label: string) => (
    <Button
      variant={status === buttonStatus ? 'contained' : 'outlined'}
      startIcon={icon}
      onClick={() => handleStatusChange(buttonStatus)}
      sx={{
        backgroundColor: status === buttonStatus ? '#1DB954' : 'transparent',
        '&:hover': {
          backgroundColor: status === buttonStatus ? '#169c46' : 'rgba(29, 185, 84, 0.1)',
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {taskData.name}
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <TimerComponent estimatedTime={taskData.estimatedTime} startTime={startTime} />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              {getStatusButton('not_started', <PlayArrow />, 'Não Iniciado')}
            </Grid>
            <Grid item xs={12} sm={4}>
              {getStatusButton('in_progress', <PlayArrow />, 'Em Progresso')}
            </Grid>
            <Grid item xs={12} sm={4}>
              {getStatusButton('break', <Pause />, 'Pausa')}
            </Grid>
            <Grid item xs={12} sm={4}>
              {getStatusButton('lunch', <RestaurantMenu />, 'Almoço')}
            </Grid>
            <Grid item xs={12} sm={4}>
              {getStatusButton('problem', <Error />, 'Problema')}
            </Grid>
            <Grid item xs={12} sm={4}>
              {getStatusButton('completed', <CheckCircle />, 'Concluído')}
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory />
                  Materiais Necessários
                </Box>
              </Typography>
              <List>
                {taskData.materials.map((material, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Inventory />
                    </ListItemIcon>
                    <ListItemText
                      primary={material.name}
                      secondary={`${material.quantity} ${material.unit}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Build />
                  Ferramentas Necessárias
                </Box>
              </Typography>
              <List>
                {taskData.tools.map((tool, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Build />
                    </ListItemIcon>
                    <ListItemText
                      primary={tool.name}
                      secondary={`Quantidade: ${tool.quantity}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Employee; 