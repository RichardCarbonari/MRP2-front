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
                },
                {
                    id: 3,
                    name: 'Ana Validadora',
                    email: 'ana.qualidade@email.com'
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
                    email: 'joao.montagema@email.com'
                },
                {
                    id: 5,
                    name: 'Roberto Montador',
                    email: 'roberto.montagema@email.com'
                },
                {
                    id: 6,
                    name: 'Fernanda Hardware',
                    email: 'fernanda.montagema@email.com'
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
                    email: 'pedro.montagemb@email.com'
                },
                {
                    id: 8,
                    name: 'Sofia Software',
                    email: 'sofia.montagemb@email.com'
                },
                {
                    id: 9,
                    name: 'Lucas Tester',
                    email: 'lucas.montagemb@email.com'
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
                    email: 'sandra.empacotamento@email.com'
                },
                {
                    id: 11,
                    name: 'Carlos Pacote',
                    email: 'carlos.empacotamento@email.com'
                },
                {
                    id: 12,
                    name: 'Julia Expedição',
                    email: 'julia.empacotamento@email.com'
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
                    email: 'ricardo.manutencao@email.com'
                },
                {
                    id: 14,
                    name: 'Bruno Técnico',
                    email: 'bruno.manutencao@email.com'
                },
                {
                    id: 15,
                    name: 'Marcos Auxiliar',
                    email: 'marcos.manutencao@email.com'
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

// CPU Types endpoint
app.get('/api/orders/cpu-types', (req, res) => {
    console.log('✅ GET /api/orders/cpu-types - Buscando tipos de CPU');
    
    const cpuTypes = {
        'gaming-basic': {
            name: 'Gaming Básico',
            price: 2500,
            specs: {
                processor: 'Intel Core i5-13400F',
                motherboard: 'ASUS TUF B660M-PLUS WiFi D4',
                ram: 'Corsair Vengeance LPX 16GB DDR4',
                storage: 'Kingston NV2 1TB NVMe',
                gpu: 'NVIDIA GeForce RTX 3060 12GB',
                powerSupply: 'Corsair CV550 550W 80 Plus Bronze',
                case: 'Cooler Master Q300L'
            }
        },
        'gaming-advanced': {
            name: 'Gaming Avançado',
            price: 4200,
            specs: {
                processor: 'Intel Core i7-13700K',
                motherboard: 'ASUS ROG STRIX Z690-E GAMING',
                ram: 'Corsair Vengeance RGB Pro 32GB DDR4',
                storage: 'Samsung 980 PRO 2TB NVMe',
                gpu: 'NVIDIA GeForce RTX 4070 Ti',
                powerSupply: 'Corsair RM750x 750W 80 Plus Gold',
                case: 'NZXT H7 Elite'
            }
        },
        'workstation': {
            name: 'Workstation',
            price: 3800,
            specs: {
                processor: 'Intel Core i7-13700',
                motherboard: 'ASUS ProArt B660-CREATOR D4',
                ram: 'Corsair Vengeance LPX 32GB DDR4',
                storage: 'Samsung 980 PRO 1TB NVMe',
                gpu: 'NVIDIA RTX A2000 12GB',
                powerSupply: 'Corsair RM650x 650W 80 Plus Gold',
                case: 'Fractal Design Define 7'
            }
        },
        'office': {
            name: 'Office',
            price: 1800,
            specs: {
                processor: 'Intel Core i3-13100',
                motherboard: 'ASUS PRIME H610M-E D4',
                ram: 'Corsair Vengeance LPX 8GB DDR4',
                storage: 'Kingston NV2 500GB NVMe',
                gpu: 'Intel UHD Graphics 730',
                powerSupply: 'Corsair CV450 450W 80 Plus Bronze',
                case: 'Cooler Master MasterBox Q300L'
            }
        },
        'budget': {
            name: 'Budget',
            price: 1200,
            specs: {
                processor: 'AMD Ryzen 3 4300G',
                motherboard: 'ASUS PRIME A320M-K',
                ram: 'Corsair Vengeance LPX 8GB DDR4',
                storage: 'Kingston NV2 250GB NVMe',
                gpu: 'AMD Radeon Graphics (Integrada)',
                powerSupply: 'Corsair CV400 400W 80 Plus Bronze',
                case: 'Cooler Master MasterBox Q300L'
            }
        }
    };
    
    res.json(cpuTypes);
});

// Orders endpoints
app.get('/api/orders', (req, res) => {
    console.log('✅ GET /api/orders - Buscando todos os pedidos');
    
    const orders = [
        {
            id: 'PED001',
            customerName: 'João Silva',
            customerEmail: 'joao@email.com',
            customerPhone: '(11) 99999-9999',
            cpuType: 'gaming-basic',
            quantity: 2,
            totalPrice: 5000,
            deliveryDate: '2024-12-20',
            status: 'pending',
            priority: 'medium',
            notes: 'Cliente prefere entrega no período da manhã',
            createdAt: '2024-12-15T10:30:00Z',
            updatedAt: '2024-12-15T10:30:00Z'
        },
        {
            id: 'PED002',
            customerName: 'Maria Santos',
            customerEmail: 'maria@email.com',
            customerPhone: '(11) 88888-8888',
            cpuType: 'workstation',
            quantity: 1,
            totalPrice: 3800,
            deliveryDate: '2024-12-22',
            status: 'assembly',
            priority: 'high',
            notes: 'Urgente para projeto corporativo',
            createdAt: '2024-12-14T14:20:00Z',
            updatedAt: '2024-12-16T09:15:00Z'
        }
    ];
    
    res.json(orders);
});

// Stats endpoint
app.get('/api/orders/stats/summary', (req, res) => {
    console.log('✅ GET /api/orders/stats/summary - Buscando estatísticas');
    
    res.json({
        summary: {
            totalOrders: 2,
            pendingOrders: 1
        }
    });
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