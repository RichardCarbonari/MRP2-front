const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3006;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Teams Management endpoints
app.get('/api/orders/teams', (req, res) => {
    console.log('✅ GET /api/orders/teams - Buscando todas as equipes');
    
    const teams = [
        {
            id: 'quality-components',
            name: '🔍 Equipe Verificação de Componentes',
            description: 'Responsável pela verificação e controle de qualidade de todos os componentes antes da montagem',
            leader: 'Maria Qualidade',
            activeProjects: 2,
            efficiency: 96,
            completedOrders: 178,
            tasks: [],
            members: [
                {
                    id: 1,
                    name: 'Maria Qualidade',
                    email: 'maria.qualidade@email.com'
                },
                {
                    id: 2,
                    name: 'Carlos Inspetor',
                    email: 'carlos.qualidade@email.com'
                }
            ]
        },
        {
            id: 'assembly-a',
            name: '🔧 Equipe Montagem A',
            description: 'Especializada na montagem física das CPUs',
            leader: 'João Silva',
            activeProjects: 4,
            efficiency: 93,
            completedOrders: 156,
            tasks: [],
            members: [
                {
                    id: 3,
                    name: 'João Silva',
                    email: 'joao.montagema@email.com'
                }
            ]
        }
    ];

    res.json(teams);
});

// Create new team
app.post('/api/orders/teams', (req, res) => {
    console.log('✅ POST /api/orders/teams - Criando nova equipe');
    const newTeam = {
        id: `team-${Date.now()}`,
        ...req.body,
        members: [],
        tasks: [],
        activeProjects: 0,
        efficiency: 85,
        completedOrders: 0
    };
    
    res.status(201).json(newTeam);
});

// Update team
app.put('/api/orders/teams/:id', (req, res) => {
    console.log(`✅ PUT /api/orders/teams/${req.params.id} - Atualizando equipe`);
    const updatedTeam = {
        id: req.params.id,
        ...req.body
    };
    
    res.json(updatedTeam);
});

// Delete team
app.delete('/api/orders/teams/:id', (req, res) => {
    console.log(`✅ DELETE /api/orders/teams/${req.params.id} - Deletando equipe`);
    res.json({ message: 'Equipe deletada com sucesso' });
});

// Add member to team
app.post('/api/orders/teams/:id/members', (req, res) => {
    console.log(`✅ POST /api/orders/teams/${req.params.id}/members - Adicionando membro`);
    const newMember = {
        id: Date.now(),
        ...req.body
    };
    
    res.status(201).json(newMember);
});

// Add task to team
app.post('/api/orders/teams/:id/tasks', (req, res) => {
    console.log(`✅ POST /api/orders/teams/${req.params.id}/tasks - Adicionando tarefa`);
    const newTask = {
        id: `task-${Date.now()}`,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newTask);
});

// Update task status
app.put('/api/orders/teams/:teamId/tasks/:taskId', (req, res) => {
    console.log(`✅ PUT /api/orders/teams/${req.params.teamId}/tasks/${req.params.taskId} - Atualizando status da tarefa`);
    const updatedTask = {
        id: req.params.taskId,
        ...req.body
    };
    
    res.json(updatedTask);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'MRP2 Backend API funcionando!',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

app.listen(PORT, () => {
    console.log(`🚀 MRP2 Backend Server rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`👥 Teams API: http://localhost:${PORT}/api/orders/teams`);
}); 