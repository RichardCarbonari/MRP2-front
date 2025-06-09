const http = require('http');
const url = require('url');

const PORT = 3006;

// Mock data para equipes
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

// Função para configurar headers CORS
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Servidor HTTP
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    console.log(`🔄 ${method} ${path}`);

    // Configurar CORS para todas as respostas
    setCorsHeaders(res);

    // Responder a requisições OPTIONS (CORS preflight)
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // GET /api/orders/teams
    if (path === '/api/orders/teams' && method === 'GET') {
        console.log('✅ GET /api/orders/teams - Buscando todas as equipes');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(teams, null, 2));
        return;
    }

    // POST /api/orders/teams
    if (path === '/api/orders/teams' && method === 'POST') {
        console.log('✅ POST /api/orders/teams - Criando nova equipe');
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newTeam = JSON.parse(body);
                newTeam.id = `team-${Date.now()}`;
                newTeam.members = [];
                newTeam.tasks = [];
                newTeam.activeProjects = 0;
                newTeam.efficiency = 85;
                newTeam.completedOrders = 0;
                
                teams.push(newTeam);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newTeam, null, 2));
            } catch (error) {
                console.error('❌ Erro ao criar equipe:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dados inválidos' }));
            }
        });
        return;
    }

    // GET /api/orders/cpu-types - CPU Types
    if (path === '/api/orders/cpu-types' && method === 'GET') {
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
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cpuTypes, null, 2));
        return;
    }

    // GET /api/orders - Orders list
    if (path === '/api/orders' && method === 'GET') {
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
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(orders, null, 2));
        return;
    }

    // GET /api/orders/stats/summary - Stats
    if (path === '/api/orders/stats/summary' && method === 'GET') {
        console.log('✅ GET /api/orders/stats/summary - Buscando estatísticas');
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            summary: {
                totalOrders: 2,
                pendingOrders: 1
            }
        }, null, 2));
        return;
    }

    // GET /api/inventory/items - Inventory Items
    if (path === '/api/inventory/items' && method === 'GET') {
        console.log('✅ GET /api/inventory/items - Buscando itens do inventário');
        
        const inventoryItems = [
            {
                id: 'cpu-i5-13400f',
                name: 'Intel Core i5-13400F',
                category: 'Processador',
                brand: 'Intel',
                model: 'i5-13400F',
                quantity: 25,
                minStock: 10,
                price: 1200.00,
                value: 1200.00,
                unit: 'unidade',
                supplier: 'TechDistribuidor',
                location: 'Estoque A1',
                lastUpdated: '2024-12-16T10:30:00Z',
                status: 'disponível'
            },
            {
                id: 'mb-asus-tuf-b660',
                name: 'ASUS TUF B660M-PLUS WiFi D4',
                category: 'Placa-mãe',
                brand: 'ASUS',
                model: 'TUF B660M-PLUS',
                quantity: 18,
                minStock: 8,
                price: 750.00,
                value: 750.00,
                unit: 'unidade',
                supplier: 'TechDistribuidor',
                location: 'Estoque A2',
                lastUpdated: '2024-12-16T10:30:00Z',
                status: 'disponível'
            },
            {
                id: 'ram-corsair-16gb',
                name: 'Corsair Vengeance LPX 16GB DDR4',
                category: 'Memória RAM',
                brand: 'Corsair',
                model: 'Vengeance LPX',
                quantity: 32,
                minStock: 15,
                price: 420.00,
                value: 420.00,
                unit: 'unidade',
                supplier: 'MemoryTech',
                location: 'Estoque B1',
                lastUpdated: '2024-12-16T10:30:00Z',
                status: 'disponível'
            },
            {
                id: 'ssd-kingston-1tb',
                name: 'Kingston NV2 1TB NVMe',
                category: 'Armazenamento',
                brand: 'Kingston',
                model: 'NV2 1TB',
                quantity: 22,
                minStock: 12,
                price: 350.00,
                value: 350.00,
                unit: 'unidade',
                supplier: 'StoragePlus',
                location: 'Estoque B2',
                lastUpdated: '2024-12-16T10:30:00Z',
                status: 'disponível'
            },
            {
                id: 'gpu-rtx-3060',
                name: 'NVIDIA GeForce RTX 3060 12GB',
                category: 'Placa de Vídeo',
                brand: 'NVIDIA',
                model: 'RTX 3060',
                quantity: 8,
                minStock: 5,
                price: 1800.00,
                value: 1800.00,
                unit: 'unidade',
                supplier: 'GraphicsHub',
                location: 'Estoque C1',
                lastUpdated: '2024-12-16T10:30:00Z',
                status: 'estoque baixo'
            },
            {
                id: 'psu-corsair-550w',
                name: 'Corsair CV550 550W 80 Plus Bronze',
                category: 'Fonte',
                brand: 'Corsair',
                model: 'CV550',
                quantity: 15,
                minStock: 8,
                price: 320.00,
                value: 320.00,
                unit: 'unidade',
                supplier: 'PowerSupply Co',
                location: 'Estoque C2',
                lastUpdated: '2024-12-16T10:30:00Z',
                status: 'disponível'
            }
        ];
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(inventoryItems, null, 2));
        return;
    }

    // GET /api/inventory/tools - Inventory Tools
    if (path === '/api/inventory/tools' && method === 'GET') {
        console.log('✅ GET /api/inventory/tools - Buscando ferramentas do inventário');
        
        const inventoryTools = [
            {
                id: 'tool-multimeter',
                name: 'Multímetro Digital',
                category: 'Medição',
                type: 'Medição',
                brand: 'Fluke',
                model: '117',
                quantity: 5,
                minStock: 2,
                condition: 'excelente',
                lastMaintenance: '2024-11-15T00:00:00Z',
                nextMaintenance: '2025-02-15T00:00:00Z',
                location: 'Bancada A1',
                status: 'disponível'
            },
            {
                id: 'tool-screwdriver-set',
                name: 'Kit Chaves de Fenda Magnéticas',
                category: 'Montagem',
                type: 'Montagem',
                brand: 'iFixit',
                model: 'Pro Tech Toolkit',
                quantity: 8,
                minStock: 3,
                condition: 'bom',
                lastMaintenance: '2024-12-01T00:00:00Z',
                nextMaintenance: '2025-03-01T00:00:00Z',
                location: 'Armário B2',
                status: 'disponível'
            },
            {
                id: 'tool-thermal-paste',
                name: 'Pasta Térmica Arctic Silver 5',
                category: 'Consumível',
                type: 'Consumível',
                brand: 'Arctic Silver',
                model: 'AS5-3.5G',
                quantity: 12,
                minStock: 5,
                condition: 'novo',
                lastMaintenance: '2024-11-01T00:00:00Z',
                nextMaintenance: '2025-02-01T00:00:00Z',
                location: 'Prateleira C3',
                status: 'disponível'
            },
            {
                id: 'tool-anti-static-wrist',
                name: 'Pulseira Antiestática',
                category: 'Segurança',
                type: 'Segurança',
                brand: 'Generic',
                model: 'ESD-WS',
                quantity: 10,
                minStock: 4,
                condition: 'bom',
                lastMaintenance: '2024-10-20T00:00:00Z',
                nextMaintenance: '2025-01-20T00:00:00Z',
                location: 'Bancada A2',
                status: 'disponível'
            },
            {
                id: 'tool-heat-gun',
                name: 'Soprador Térmico',
                category: 'Reparação',
                type: 'Reparação',
                brand: 'Bosch',
                model: 'GHG 23-66',
                quantity: 2,
                minStock: 1,
                condition: 'bom',
                lastMaintenance: '2024-11-30T00:00:00Z',
                nextMaintenance: '2025-02-28T00:00:00Z',
                location: 'Bancada D1',
                status: 'em uso'
            },
            {
                id: 'tool-cable-tester',
                name: 'Testador de Cabos',
                category: 'Teste',
                type: 'Teste',
                brand: 'Klein Tools',
                model: 'VDV526-052',
                quantity: 3,
                minStock: 1,
                condition: 'excelente',
                lastMaintenance: '2024-12-10T00:00:00Z',
                nextMaintenance: '2025-03-10T00:00:00Z',
                location: 'Bancada A3',
                status: 'disponível'
            }
        ];
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(inventoryTools, null, 2));
        return;
    }

    // GET /api/financial/cpu-sales - CPU Sales Data
    if (path === '/api/financial/cpu-sales' && method === 'GET') {
        console.log('✅ GET /api/financial/cpu-sales - Buscando vendas de CPUs');
        
        const cpuSalesData = [
            {
                model: 'Gaming Básico',
                cpuType: 'gaming-basic',
                unitsSold: 45,
                unitsProduced: 50,
                revenue: 112500,
                productionCost: 87500,
                averagePrice: 2500,
                profitMargin: 22.2,
                components: {
                    processor: 'Intel Core i5-13400F',
                    motherboard: 'ASUS TUF B660M-PLUS WiFi D4',
                    ram: 'Corsair Vengeance LPX 16GB DDR4',
                    storage: 'Kingston NV2 1TB NVMe',
                    gpu: 'NVIDIA GeForce RTX 3060 12GB'
                }
            },
            {
                model: 'Gaming Avançado',
                cpuType: 'gaming-advanced',
                unitsSold: 32,
                unitsProduced: 35,
                revenue: 134400,
                productionCost: 104300,
                averagePrice: 4200,
                profitMargin: 22.4,
                components: {
                    processor: 'Intel Core i7-13700K',
                    motherboard: 'ASUS ROG STRIX Z690-E GAMING',
                    ram: 'Corsair Vengeance RGB Pro 32GB DDR4',
                    storage: 'Samsung 980 PRO 2TB NVMe',
                    gpu: 'NVIDIA GeForce RTX 4070 Ti'
                }
            },
            {
                model: 'Workstation',
                cpuType: 'workstation',
                unitsSold: 28,
                unitsProduced: 30,
                revenue: 106400,
                productionCost: 81600,
                averagePrice: 3800,
                profitMargin: 23.3,
                components: {
                    processor: 'Intel Core i7-13700',
                    motherboard: 'ASUS ProArt B660-CREATOR D4',
                    ram: 'Corsair Vengeance LPX 32GB DDR4',
                    storage: 'Samsung 980 PRO 1TB NVMe',
                    gpu: 'NVIDIA RTX A2000 12GB'
                }
            },
            {
                model: 'Office',
                cpuType: 'office',
                unitsSold: 67,
                unitsProduced: 70,
                revenue: 120600,
                productionCost: 98800,
                averagePrice: 1800,
                profitMargin: 18.1,
                components: {
                    processor: 'Intel Core i3-13100',
                    motherboard: 'ASUS PRIME H610M-E D4',
                    ram: 'Corsair Vengeance LPX 8GB DDR4',
                    storage: 'Kingston NV2 500GB NVMe',
                    gpu: 'Intel UHD Graphics 730'
                }
            },
            {
                model: 'Budget',
                cpuType: 'budget',
                unitsSold: 89,
                unitsProduced: 95,
                revenue: 106800,
                productionCost: 89300,
                averagePrice: 1200,
                profitMargin: 16.4,
                components: {
                    processor: 'AMD Ryzen 3 4300G',
                    motherboard: 'ASUS PRIME A320M-K',
                    ram: 'Corsair Vengeance LPX 8GB DDR4',
                    storage: 'Kingston NV2 250GB NVMe',
                    gpu: 'AMD Radeon Graphics (Integrada)'
                }
            }
        ];
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cpuSalesData, null, 2));
        return;
    }

    // GET /api/financial - Get Financial Data
    if (path === '/api/financial' && method === 'GET') {
        console.log('✅ GET /api/financial - Buscando dados financeiros');
        
        const financialData = {
            operationalCosts: {
                labor: 35000,
                components: 180000,
                logistics: 12000,
                utilities: 8000,
                maintenance: 5000,
                total: 240000
            },
            productSales: [
                {
                    category: 'Gaming Básico',
                    unitsSold: 45,
                    revenue: 112500,
                    averagePrice: 2500,
                    profitMargin: 22.2
                },
                {
                    category: 'Gaming Avançado',
                    unitsSold: 32,
                    revenue: 134400,
                    averagePrice: 4200,
                    profitMargin: 22.4
                },
                {
                    category: 'Workstation',
                    unitsSold: 28,
                    revenue: 106400,
                    averagePrice: 3800,
                    profitMargin: 23.3
                },
                {
                    category: 'Office',
                    unitsSold: 67,
                    revenue: 120600,
                    averagePrice: 1800,
                    profitMargin: 18.1
                },
                {
                    category: 'Budget',
                    unitsSold: 89,
                    revenue: 106800,
                    averagePrice: 1200,
                    profitMargin: 16.4
                }
            ],
            totalRevenue: 580700,
            totalCosts: 240000,
            grossProfit: 340700,
            netProfit: 295000,
            profitMargin: 50.8,
            monthlyComparison: {
                grossProfitChange: 12.5,
                netProfitChange: 15.2,
                revenueChange: 8.7
            }
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(financialData, null, 2));
        return;
    }

    // PUT /api/financial - Update Financial Data
    if (path === '/api/financial' && method === 'PUT') {
        console.log('✅ PUT /api/financial - Atualizando dados financeiros');
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const updateData = JSON.parse(body);
                console.log('📊 Dados financeiros recebidos:', updateData);
                
                // Simular processamento e cálculos
                const total = Object.values(updateData.operationalCosts || {})
                    .filter(val => typeof val === 'number')
                    .reduce((sum, val) => sum + val, 0);
                
                const responseData = {
                    success: true,
                    message: 'Dados financeiros atualizados com sucesso',
                    updatedAt: new Date().toISOString(),
                    summary: {
                        totalCosts: total,
                        recordsUpdated: updateData.productSales?.length || 0
                    }
                };
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao processar dados financeiros:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dados inválidos' }));
            }
        });
        return;
    }

    // GET /api/financial/history/:period - Financial History
    if (path.startsWith('/api/financial/history/') && method === 'GET') {
        const period = path.split('/').pop();
        console.log(`✅ GET /api/financial/history/${period} - Buscando histórico financeiro`);
        
        const historyData = {
            period: period,
            data: [
                {
                    date: '2024-11-01',
                    revenue: 520000,
                    costs: 220000,
                    profit: 300000
                },
                {
                    date: '2024-11-15',
                    revenue: 580000,
                    costs: 240000,
                    profit: 340000
                },
                {
                    date: '2024-12-01',
                    revenue: 580700,
                    costs: 240000,
                    profit: 340700
                }
            ]
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(historyData, null, 2));
        return;
    }

    // GET /api/financial/costs/:costType - Cost Details
    if (path.startsWith('/api/financial/costs/') && method === 'GET') {
        const costType = path.split('/').pop();
        console.log(`✅ GET /api/financial/costs/${costType} - Buscando detalhes de custos`);
        
        const costDetails = {
            costType: costType,
            breakdown: [
                {
                    item: `${costType} - Item 1`,
                    amount: 15000,
                    percentage: 35
                },
                {
                    item: `${costType} - Item 2`,
                    amount: 12000,
                    percentage: 28
                },
                {
                    item: `${costType} - Item 3`,
                    amount: 8000,
                    percentage: 19
                }
            ],
            total: 35000,
            trend: '+5.2%'
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(costDetails, null, 2));
        return;
    }

    // POST /api/auth/login - User Login
    if (path === '/api/auth/login' && method === 'POST') {
        console.log('✅ POST /api/auth/login - Login do usuário');
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { email, password } = JSON.parse(body);
                console.log(`🔐 Tentativa de login para: ${email}`);
                
                        // Usuários mock para demonstração
        const mockUsers = [
            {
                id: 'admin-1',
                email: 'carlos.diretor@mrp2cpu.com.br',
                password: 'admin123',
                name: 'Carlos Diretor',
                role: 'admin'
            },
            {
                id: 'employee-1',
                email: 'funcionario@mrp2.com',
                password: 'func123',
                name: 'João Funcionário',
                role: 'employee'
            },
            {
                id: 'maintenance-1',
                email: 'joao.manutencao@mrp2cpu.com.br',
                password: 'manut123',
                name: 'João Manutenção',
                role: 'maintenance'
            }
        ];
                
                // Buscar usuário
                const user = mockUsers.find(u => u.email === email && u.password === password);
                
                if (!user) {
                    console.log('❌ Credenciais inválidas');
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        message: 'Credenciais inválidas'
                    }));
                    return;
                }
                
                // Gerar token mock
                const token = `mock-token-${user.id}-${Date.now()}`;
                
                console.log(`✅ Login realizado com sucesso para ${user.name} (${user.role})`);
                
                const responseData = {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    },
                    token: token
                };
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao processar login:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Dados inválidos' }));
            }
        });
        return;
    }

    // POST /api/auth/register - User Registration
    if (path === '/api/auth/register' && method === 'POST') {
        console.log('✅ POST /api/auth/register - Registro do usuário');
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { email, password, name, role } = JSON.parse(body);
                console.log(`📝 Tentativa de registro para: ${email}`);
                
                // Validações simples
                if (!email || !password || !name || !role) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Todos os campos são obrigatórios' }));
                    return;
                }
                
                if (!['admin', 'employee', 'maintenance'].includes(role)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Tipo de usuário inválido' }));
                    return;
                }
                
                // Simular criação do usuário
                const newUser = {
                    id: `user-${Date.now()}`,
                    email,
                    name,
                    role
                };
                
                const token = `mock-token-${newUser.id}-${Date.now()}`;
                
                console.log(`✅ Usuário ${name} registrado com sucesso (${role})`);
                
                const responseData = {
                    user: newUser,
                    token: token
                };
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao processar registro:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Dados inválidos' }));
            }
        });
        return;
    }

    // POST /api/auth/verify-email - Verify if email exists for password reset
    if (path === '/api/auth/verify-email' && method === 'POST') {
        console.log('✅ POST /api/auth/verify-email - Verificando email para recuperação');
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { email } = JSON.parse(body);
                console.log(`📧 Verificando email: ${email}`);
                
                // Usuários mock para demonstração (mesmo array do login)
                const mockUsers = [
                    {
                        id: 'admin-1',
                        email: 'carlos.diretor@mrp2cpu.com.br',
                        password: 'admin123',
                        name: 'Carlos Diretor',
                        role: 'admin'
                    },
                    {
                        id: 'employee-1',
                        email: 'funcionario@mrp2.com',
                        password: 'func123',
                        name: 'João Funcionário',
                        role: 'employee'
                    },
                    {
                        id: 'maintenance-1',
                        email: 'joao.manutencao@mrp2cpu.com.br',
                        password: 'manut123',
                        name: 'João Manutenção',
                        role: 'maintenance'
                    }
                ];
                
                // Buscar usuário pelo email
                const user = mockUsers.find(u => u.email === email);
                
                if (!user) {
                    console.log('❌ Email não encontrado');
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        message: 'Email não encontrado no sistema'
                    }));
                    return;
                }
                
                console.log(`✅ Email ${email} encontrado para usuário: ${user.name}`);
                
                const responseData = {
                    success: true,
                    message: 'Email encontrado no sistema',
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                };
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao verificar email:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Dados inválidos' }));
            }
        });
        return;
    }

    // PUT /api/auth/reset-password - Reset password after email verification
    if (path === '/api/auth/reset-password' && method === 'PUT') {
        console.log('✅ PUT /api/auth/reset-password - Redefinindo senha');
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { email, newPassword } = JSON.parse(body);
                console.log(`🔒 Redefinindo senha para: ${email}`);
                
                // Validar nova senha
                if (!newPassword || newPassword.length < 6) {
                    console.log('❌ Nova senha muito fraca');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        error: 'Nova senha deve ter pelo menos 6 caracteres',
                        field: 'newPassword'
                    }));
                    return;
                }
                
                // Simular atualização da senha no banco
                console.log('✅ Senha redefinida com sucesso');
                
                const responseData = {
                    success: true,
                    message: 'Senha redefinida com sucesso',
                    timestamp: new Date().toISOString()
                };
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao redefinir senha:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dados inválidos' }));
            }
        });
        return;
    }

    // PUT /api/auth/change-password - Change User Password
    if (path === '/api/auth/change-password' && method === 'PUT') {
        console.log('✅ PUT /api/auth/change-password - Alterando senha do usuário');
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { currentPassword, newPassword } = JSON.parse(body);
                console.log('🔒 Solicitação de mudança de senha recebida');
                
                // Simular validação da senha atual
                const mockCurrentPassword = 'senha123'; // Em produção, seria obtida do banco de dados
                
                if (currentPassword !== mockCurrentPassword) {
                    console.log('❌ Senha atual incorreta');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        error: 'Senha atual incorreta',
                        field: 'currentPassword'
                    }));
                    return;
                }
                
                // Simular validação da nova senha
                if (newPassword.length < 6) {
                    console.log('❌ Nova senha muito fraca');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        error: 'Nova senha deve ter pelo menos 6 caracteres',
                        field: 'newPassword'
                    }));
                    return;
                }
                
                if (currentPassword === newPassword) {
                    console.log('❌ Nova senha igual à atual');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        error: 'Nova senha deve ser diferente da atual',
                        field: 'newPassword'
                    }));
                    return;
                }
                
                // Simular atualização da senha no banco
                console.log('✅ Senha alterada com sucesso');
                
                const responseData = {
                    success: true,
                    message: 'Senha alterada com sucesso',
                    timestamp: new Date().toISOString()
                };
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao processar mudança de senha:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dados inválidos' }));
            }
        });
        return;
    }

    // GET /health - Health Check
    if (path === '/health' && method === 'GET') {
        console.log('✅ GET /health - Health check');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: '1.0.0'
        }));
        return;
    }

    // GET /api/hello - Rota de teste
    if (path === '/api/hello' && method === 'GET') {
        console.log('✅ GET /api/hello - Teste de conectividade');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Backend funcionando!', timestamp: new Date().toISOString() }));
        return;
    }

    // GET /api/quality/reports - Get Quality Reports
    if (path === '/api/quality/reports' && method === 'GET') {
        console.log('✅ GET /api/quality/reports - Buscando relatórios de qualidade');
        
        const qualityReports = [
            {
                id: 1,
                productId: 'CPU001',
                productName: 'Processador Intel i7-13700K',
                batchNumber: 'L20240315001',
                defectType: 'Falha Funcional',
                description: 'Frequência instável durante testes de stress, apresentando throttling excessivo',
                reportedAt: new Date('2024-03-20T10:30:00'),
                reportedBy: 'João Silva - QC',
                status: 'pending',
                priority: 'high'
            },
            {
                id: 2,
                productId: 'MB002',
                productName: 'Placa-mãe ASUS ROG Gaming',
                batchNumber: 'L20240315002',
                defectType: 'Defeito Visual',
                description: 'Arranhões na superfície do dissipador de calor, não afeta funcionalidade',
                reportedAt: new Date('2024-03-20T09:15:00'),
                reportedBy: 'Maria Santos - QC',
                status: 'reviewing',
                priority: 'medium'
            },
            {
                id: 3,
                productId: 'CPU003',
                productName: 'Processador AMD Ryzen 9',
                batchNumber: 'L20240314003',
                defectType: 'Falha Elétrica',
                description: 'Consumo de energia acima do especificado em idle',
                reportedAt: new Date('2024-03-19T14:20:00'),
                reportedBy: 'Carlos Oliveira - QC',
                status: 'resolved',
                priority: 'high',
                resolution: 'Problema identificado no firmware. Aplicado update v2.1.3. Retestado com sucesso.',
                resolvedAt: new Date('2024-03-20T16:45:00'),
                resolvedBy: 'Ana Costa - Engenharia'
            },
            {
                id: 4,
                productId: 'GPU001',
                productName: 'Placa de Vídeo RTX 4070',
                batchNumber: 'L20240316004',
                defectType: 'Defeito Térmico',
                description: 'Superaquecimento durante benchmark 3DMark',
                reportedAt: new Date('2024-03-21T08:30:00'),
                reportedBy: 'Pedro Lima - QC',
                status: 'pending',
                priority: 'critical'
            },
            {
                id: 5,
                productId: 'RAM001',
                productName: 'Memória DDR5 32GB Kit',
                batchNumber: 'L20240317005',
                defectType: 'Erro de Memória',
                description: 'Falha em teste MemTest86+ após 2 horas',
                reportedAt: new Date('2024-03-21T11:15:00'),
                reportedBy: 'Fernanda Rocha - QC',
                status: 'reviewing',
                priority: 'high'
            }
        ];
        
        const responseData = {
            success: true,
            data: qualityReports,
            totalReports: qualityReports.length,
            pendingCount: qualityReports.filter(r => r.status === 'pending').length,
            reviewingCount: qualityReports.filter(r => r.status === 'reviewing').length,
            resolvedCount: qualityReports.filter(r => r.status === 'resolved').length,
            timestamp: new Date().toISOString()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData, null, 2));
        return;
    }

    // PUT /api/quality/reports/:id/resolve - Resolve Quality Report
    if (path.startsWith('/api/quality/reports/') && path.endsWith('/resolve') && method === 'PUT') {
        console.log('✅ PUT /api/quality/reports/*/resolve - Resolvendo relatório de qualidade');
        
        const reportId = path.split('/')[4]; // Extrair ID da URL
        
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { resolution, resolvedBy } = JSON.parse(body);
                console.log(`🔧 Resolvendo relatório ${reportId}: ${resolution}`);
                
                if (!resolution || resolution.trim().length === 0) {
                    console.log('❌ Resolução não fornecida');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        error: 'Descrição da resolução é obrigatória',
                        field: 'resolution'
                    }));
                    return;
                }
                
                // Simular atualização no banco
                const responseData = {
                    success: true,
                    message: `Relatório #${reportId} resolvido com sucesso`,
                    data: {
                        id: parseInt(reportId),
                        status: 'resolved',
                        resolution: resolution,
                        resolvedAt: new Date().toISOString(),
                        resolvedBy: resolvedBy || 'Sistema'
                    },
                    timestamp: new Date().toISOString()
                };
                
                console.log(`✅ Relatório ${reportId} resolvido com sucesso`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao resolver relatório:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dados inválidos' }));
            }
        });
        return;
    }

    // GET /api/quality/metrics - Get Quality Metrics
    if (path === '/api/quality/metrics' && method === 'GET') {
        console.log('✅ GET /api/quality/metrics - Buscando métricas de qualidade');
        
        const metrics = {
            totalReports: 25,
            pendingReports: 8,
            reviewingReports: 5,
            resolvedReports: 12,
            resolutionRate: 68.0,
            averageResolutionTime: 2.3, // dias
            criticalIssues: 3,
            highPriorityIssues: 7,
            defectsByType: {
                'Falha Funcional': 8,
                'Defeito Visual': 5,
                'Falha Elétrica': 6,
                'Defeito Térmico': 4,
                'Erro de Memória': 2
            },
            monthlyTrend: [
                { month: 'Jan', reports: 18, resolved: 15 },
                { month: 'Fev', reports: 22, resolved: 19 },
                { month: 'Mar', reports: 25, resolved: 17 }
            ]
        };
        
        const responseData = {
            success: true,
            data: metrics,
            timestamp: new Date().toISOString()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData, null, 2));
        return;
    }

    // GET /api/maintenance/equipment - Get Equipment List
    if (path === '/api/maintenance/equipment' && method === 'GET') {
        console.log('✅ GET /api/maintenance/equipment - Buscando lista de equipamentos');
        
        const equipment = [
            // 🔍 EQUIPAMENTOS DA EQUIPE VERIFICAÇÃO DE COMPONENTES
            {
                id: 1,
                name: 'Estação de Teste de Processadores Intel/AMD',
                type: 'Equipamento de Teste de CPU',
                status: 'operational',
                lastMaintenance: new Date('2024-02-15'),
                nextMaintenance: new Date('2024-04-15'),
                location: 'Setor Verificação - QC1',
                serialNumber: 'CPUT-2023-001',
                manufacturer: 'Intel Test Solutions',
                model: 'CPU-Tester Pro 3000',
                assignedTeam: 'quality-components',
                description: 'Estação automatizada para teste de funcionalidade e stress de processadores Intel e AMD'
            },
            {
                id: 2,
                name: 'Bancada de Teste de Memória RAM DDR4/DDR5',
                type: 'Equipamento de Teste de Memória',
                status: 'operational',
                lastMaintenance: new Date('2024-03-01'),
                nextMaintenance: new Date('2024-05-01'),
                location: 'Setor Verificação - QC2',
                serialNumber: 'RAMT-2023-002',
                manufacturer: 'Kingston Technology',
                model: 'MemTest Pro 2000',
                assignedTeam: 'quality-components',
                description: 'Sistema de teste completo para validação de módulos de memória DDR4 e DDR5'
            },
            {
                id: 3,
                name: 'Estação de Validação de Placas-Mãe',
                type: 'Equipamento de Teste de Motherboard',
                status: 'maintenance',
                lastMaintenance: new Date('2024-03-10'),
                nextMaintenance: new Date('2024-03-20'),
                location: 'Setor Verificação - QC3',
                serialNumber: 'MOBT-2023-003',
                manufacturer: 'ASUS QA Division',
                model: 'MotherBoard Validator V4',
                assignedTeam: 'quality-components',
                description: 'Sistema automatizado para teste de todas as funcionalidades de placas-mãe'
            },

            // 🔧 EQUIPAMENTOS DA EQUIPE MONTAGEM A (HARDWARE)
            {
                id: 4,
                name: 'Bancada de Montagem Antiestática Premium',
                type: 'Estação de Montagem',
                status: 'operational',
                lastMaintenance: new Date('2024-02-20'),
                nextMaintenance: new Date('2024-05-20'),
                location: 'Setor Montagem A - MA1',
                serialNumber: 'BANK-2023-004',
                manufacturer: 'StarTech Professional',
                model: 'ESD-Workbench Pro 2000',
                assignedTeam: 'assembly-a',
                description: 'Bancada profissional com proteção antiestática, iluminação LED e ferramentas integradas'
            },
            {
                id: 5,
                name: 'Kit de Ferramentas Profissional para Montagem',
                type: 'Ferramentas de Montagem',
                status: 'operational',
                lastMaintenance: new Date('2024-01-15'),
                nextMaintenance: new Date('2024-04-15'),
                location: 'Setor Montagem A - MA2',
                serialNumber: 'TOOL-2023-005',
                manufacturer: 'iFixit Professional',
                model: 'PC Builder Toolkit Pro',
                assignedTeam: 'assembly-a',
                description: 'Kit completo com chaves de precisão, pulseira antiestática, pasta térmica e organizadores'
            },
            {
                id: 6,
                name: 'Estação de Aplicação de Pasta Térmica Automatizada',
                type: 'Equipamento de Aplicação Térmica',
                status: 'operational',
                lastMaintenance: new Date('2024-03-05'),
                nextMaintenance: new Date('2024-06-05'),
                location: 'Setor Montagem A - MA3',
                serialNumber: 'TERM-2023-006',
                manufacturer: 'Thermal Grizzly Systems',
                model: 'ThermalBot Auto-Applicator',
                assignedTeam: 'assembly-a',
                description: 'Sistema robotizado para aplicação precisa e uniforme de pasta térmica em processadores'
            },

            // 💻 EQUIPAMENTOS DA EQUIPE MONTAGEM B (SOFTWARE)
            {
                id: 7,
                name: 'Servidor de Imagens de Sistema Operacional',
                type: 'Servidor de Deploy',
                status: 'operational',
                lastMaintenance: new Date('2024-02-25'),
                nextMaintenance: new Date('2024-05-25'),
                location: 'Setor Montagem B - MB1',
                serialNumber: 'OSRV-2023-007',
                manufacturer: 'Microsoft Enterprise',
                model: 'Windows Deployment Server Pro',
                assignedTeam: 'assembly-b',
                description: 'Servidor dedicado para deploy automatizado de Windows 10/11 e drivers específicos'
            },
            {
                id: 8,
                name: 'Estação de Teste de Performance e Benchmark',
                type: 'Sistema de Benchmark',
                status: 'operational',
                lastMaintenance: new Date('2024-03-12'),
                nextMaintenance: new Date('2024-06-12'),
                location: 'Setor Montagem B - MB2',
                serialNumber: 'BENCH-2023-008',
                manufacturer: 'PassMark Software',
                model: 'BurnInTest Professional Station',
                assignedTeam: 'assembly-b',
                description: 'Estação automatizada para testes de stress, benchmark e validação de performance'
            },
            {
                id: 9,
                name: 'Rack de Testes Múltiplos Simultâneos',
                type: 'Sistema de Teste Paralelo',
                status: 'broken',
                lastMaintenance: new Date('2024-03-15'),
                nextMaintenance: new Date('2024-03-25'),
                location: 'Setor Montagem B - MB3',
                serialNumber: 'RACK-2023-009',
                manufacturer: 'Custom Solutions Ltd',
                model: 'MultiTest Rack 8-Bay',
                assignedTeam: 'assembly-b',
                description: 'Sistema para testar até 8 CPUs simultaneamente com monitoramento automático'
            },

            // 📦 EQUIPAMENTOS DA EQUIPE EMPACOTAMENTO
            {
                id: 10,
                name: 'Seladora Automática de Caixas',
                type: 'Equipamento de Embalagem',
                status: 'operational',
                lastMaintenance: new Date('2024-01-30'),
                nextMaintenance: new Date('2024-04-30'),
                location: 'Setor Empacotamento - EP1',
                serialNumber: 'SEAL-2023-010',
                manufacturer: 'Packmatic Solutions',
                model: 'AutoSeal Pro 3000',
                assignedTeam: 'packaging',
                description: 'Máquina automática para selagem e fechamento de caixas com fita dupla face'
            },
            {
                id: 11,
                name: 'Impressora de Etiquetas de Envio Industrial',
                type: 'Sistema de Etiquetagem',
                status: 'operational',
                lastMaintenance: new Date('2024-02-10'),
                nextMaintenance: new Date('2024-05-10'),
                location: 'Setor Empacotamento - EP2',
                serialNumber: 'PRNT-2023-011',
                manufacturer: 'Zebra Technologies',
                model: 'ZT610 Industrial Printer',
                assignedTeam: 'packaging',
                description: 'Impressora industrial para etiquetas de envio, código de barras e QR codes'
            },

            // 🔧 EQUIPAMENTOS DA EQUIPE MANUTENÇÃO
            {
                id: 12,
                name: 'Kit de Diagnóstico Eletrônico Multimarca',
                type: 'Equipamento de Diagnóstico',
                status: 'operational',
                lastMaintenance: new Date('2024-03-01'),
                nextMaintenance: new Date('2024-06-01'),
                location: 'Oficina Manutenção - MN1',
                serialNumber: 'DIAG-2023-012',
                manufacturer: 'Fluke Corporation',
                model: 'Electronic Diagnostic Kit Pro',
                assignedTeam: 'maintenance',
                description: 'Kit completo com multímetros, osciloscópios e testadores para manutenção de equipamentos eletrônicos'
            },
            {
                id: 13,
                name: 'Compressor de Ar para Limpeza Pneumática',
                type: 'Sistema de Limpeza',
                status: 'operational',
                lastMaintenance: new Date('2024-02-05'),
                nextMaintenance: new Date('2024-05-05'),
                location: 'Oficina Manutenção - MN2',
                serialNumber: 'COMP-2023-013',
                manufacturer: 'California Air Tools',
                model: 'Ultra Quiet 4620AC',
                assignedTeam: 'maintenance',
                description: 'Compressor silencioso para limpeza de componentes eletrônicos e manutenção preventiva'
            }
        ];
        
        const responseData = {
            success: true,
            data: equipment,
            totalEquipment: equipment.length,
            operationalCount: equipment.filter(e => e.status === 'operational').length,
            maintenanceCount: equipment.filter(e => e.status === 'maintenance').length,
            brokenCount: equipment.filter(e => e.status === 'broken').length,
            timestamp: new Date().toISOString()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData, null, 2));
        return;
    }

    // POST /api/maintenance/equipment - Create Equipment
    if (path === '/api/maintenance/equipment' && method === 'POST') {
        console.log('✅ POST /api/maintenance/equipment - Criando novo equipamento');
        
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const equipmentData = JSON.parse(body);
                console.log(`🔧 Criando equipamento: ${equipmentData.name}`);
                
                // Validações básicas
                if (!equipmentData.name || !equipmentData.type) {
                    console.log('❌ Dados obrigatórios não fornecidos');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        error: 'Campos obrigatórios: name, type'
                    }));
                    return;
                }
                
                // Simular criação no banco
                const newEquipment = {
                    id: Math.floor(Math.random() * 1000) + 100,
                    ...equipmentData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                const responseData = {
                    success: true,
                    message: 'Equipamento criado com sucesso',
                    data: newEquipment,
                    timestamp: new Date().toISOString()
                };
                
                console.log(`✅ Equipamento criado com ID: ${newEquipment.id}`);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao criar equipamento:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dados inválidos' }));
            }
        });
        return;
    }

    // PUT /api/maintenance/equipment/:id - Update Equipment
    if (path.startsWith('/api/maintenance/equipment/') && method === 'PUT') {
        console.log('✅ PUT /api/maintenance/equipment/* - Atualizando equipamento');
        
        const equipmentId = path.split('/')[4]; // Extrair ID da URL
        
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const equipmentData = JSON.parse(body);
                console.log(`🔧 Atualizando equipamento ${equipmentId}: ${equipmentData.name}`);
                
                // Simular atualização no banco
                const responseData = {
                    success: true,
                    message: `Equipamento #${equipmentId} atualizado com sucesso`,
                    data: {
                        id: parseInt(equipmentId),
                        ...equipmentData,
                        updatedAt: new Date().toISOString()
                    },
                    timestamp: new Date().toISOString()
                };
                
                console.log(`✅ Equipamento ${equipmentId} atualizado com sucesso`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao atualizar equipamento:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dados inválidos' }));
            }
        });
        return;
    }

    // DELETE /api/maintenance/equipment/:id - Delete Equipment
    if (path.startsWith('/api/maintenance/equipment/') && method === 'DELETE') {
        console.log('✅ DELETE /api/maintenance/equipment/* - Removendo equipamento');
        
        const equipmentId = path.split('/')[4]; // Extrair ID da URL
        console.log(`🗑️ Removendo equipamento ${equipmentId}`);
        
        // Simular remoção no banco
        const responseData = {
            success: true,
            message: `Equipamento #${equipmentId} removido com sucesso`,
            timestamp: new Date().toISOString()
        };
        
        console.log(`✅ Equipamento ${equipmentId} removido com sucesso`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData, null, 2));
        return;
    }

    // GET /api/maintenance/records - Get Maintenance Records
    if (path === '/api/maintenance/records' && method === 'GET') {
        console.log('✅ GET /api/maintenance/records - Buscando registros de manutenção');
        
        const maintenanceRecords = [
            {
                id: 1,
                equipmentId: 3,
                equipmentName: 'Estação de Validação de Placas-Mãe',
                type: 'corrective',
                description: 'Reparo do sistema de teste de slots DIMM - Atualização de firmware e calibração',
                date: new Date('2024-03-20'),
                technician: 'Ricardo Manutenção',
                cost: 450.00,
                status: 'scheduled',
                priority: 'high',
                estimatedDuration: 3, // horas
                notes: 'Equipamento apresentando falhas intermitentes nos testes de memória'
            },
            {
                id: 2,
                equipmentId: 9,
                equipmentName: 'Rack de Testes Múltiplos Simultâneos',
                type: 'corrective',
                description: 'Substituição de fonte de alimentação queimada na baía 5 - Reparo urgente',
                date: new Date('2024-03-25'),
                technician: 'Bruno Técnico',
                cost: 680.00,
                status: 'in_progress',
                priority: 'critical',
                estimatedDuration: 4,
                notes: 'Fonte de 750W em estoque, instalação em andamento'
            },
            {
                id: 3,
                equipmentId: 1,
                equipmentName: 'Estação de Teste de Processadores Intel/AMD',
                type: 'preventive',
                description: 'Manutenção preventiva trimestral - Limpeza de contatos e atualização de microcode',
                date: new Date('2024-02-15'),
                technician: 'Maria Qualidade',
                cost: 280.00,
                status: 'completed',
                priority: 'medium',
                estimatedDuration: 2,
                notes: 'Calibração concluída, todos os sockets testados e aprovados',
                completedAt: new Date('2024-02-15T14:30:00')
            },
            {
                id: 4,
                equipmentId: 6,
                equipmentName: 'Estação de Aplicação de Pasta Térmica Automatizada',
                type: 'preventive',
                description: 'Limpeza e calibração do sistema dosador - Verificação de precisão',
                date: new Date('2024-06-05'),
                technician: 'João Silva',
                cost: 320.00,
                status: 'scheduled',
                priority: 'medium',
                estimatedDuration: 2.5,
                notes: 'Verificar consistência na aplicação da pasta térmica Arctic MX-4'
            },
            {
                id: 5,
                equipmentId: 7,
                equipmentName: 'Servidor de Imagens de Sistema Operacional',
                type: 'preventive',
                description: 'Atualização de imagens Windows 11 e drivers - Backup de segurança',
                date: new Date('2024-02-25'),
                technician: 'Pedro Sistema',
                cost: 180.00,
                status: 'completed',
                priority: 'low',
                estimatedDuration: 3,
                notes: 'Imagens atualizadas para Windows 11 23H2, drivers Intel/AMD mais recentes',
                completedAt: new Date('2024-02-25T16:45:00')
            },
            {
                id: 6,
                equipmentId: 10,
                equipmentName: 'Seladora Automática de Caixas',
                type: 'preventive',
                description: 'Troca de fita dupla face e ajuste de pressão das guilhotinas',
                date: new Date('2024-04-30'),
                technician: 'Sandra Embalagem',
                cost: 120.00,
                status: 'scheduled',
                priority: 'low',
                estimatedDuration: 1,
                notes: 'Fita em estoque, procedimento de rotina mensal'
            },
            {
                id: 7,
                equipmentId: 2,
                equipmentName: 'Bancada de Teste de Memória RAM DDR4/DDR5',
                type: 'corrective',
                description: 'Substituição de módulo de teste DDR5 defeituoso',
                date: new Date('2024-03-18'),
                technician: 'Carlos Inspetor',
                cost: 890.00,
                status: 'completed',
                priority: 'high',
                estimatedDuration: 1.5,
                notes: 'Módulo DDR5-5600 substituído, testes funcionando perfeitamente',
                completedAt: new Date('2024-03-18T11:20:00')
            }
        ];
        
        const responseData = {
            success: true,
            data: maintenanceRecords,
            totalRecords: maintenanceRecords.length,
            scheduledCount: maintenanceRecords.filter(r => r.status === 'scheduled').length,
            inProgressCount: maintenanceRecords.filter(r => r.status === 'in_progress').length,
            completedCount: maintenanceRecords.filter(r => r.status === 'completed').length,
            totalCosts: maintenanceRecords.reduce((sum, r) => sum + r.cost, 0),
            timestamp: new Date().toISOString()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData, null, 2));
        return;
    }

    // POST /api/maintenance/records - Create Maintenance Record
    if (path === '/api/maintenance/records' && method === 'POST') {
        console.log('✅ POST /api/maintenance/records - Criando registro de manutenção');
        
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const recordData = JSON.parse(body);
                console.log(`📝 Criando registro de manutenção para equipamento: ${recordData.equipmentId}`);
                
                // Validações básicas
                if (!recordData.equipmentId || !recordData.description || !recordData.technician) {
                    console.log('❌ Dados obrigatórios não fornecidos');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        error: 'Campos obrigatórios: equipmentId, description, technician'
                    }));
                    return;
                }
                
                // Simular criação no banco
                const newRecord = {
                    id: Math.floor(Math.random() * 1000) + 100,
                    ...recordData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                const responseData = {
                    success: true,
                    message: 'Registro de manutenção criado com sucesso',
                    data: newRecord,
                    timestamp: new Date().toISOString()
                };
                
                console.log(`✅ Registro criado com ID: ${newRecord.id}`);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao criar registro:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dados inválidos' }));
            }
        });
        return;
    }

    // PUT /api/maintenance/records/:id - Update Maintenance Record
    if (path.startsWith('/api/maintenance/records/') && method === 'PUT') {
        console.log('✅ PUT /api/maintenance/records/* - Atualizando registro de manutenção');
        
        const recordId = path.split('/')[4]; // Extrair ID da URL
        
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const recordData = JSON.parse(body);
                console.log(`📝 Atualizando registro ${recordId}`);
                
                // Simular atualização no banco
                const responseData = {
                    success: true,
                    message: `Registro #${recordId} atualizado com sucesso`,
                    data: {
                        id: parseInt(recordId),
                        ...recordData,
                        updatedAt: new Date().toISOString()
                    },
                    timestamp: new Date().toISOString()
                };
                
                console.log(`✅ Registro ${recordId} atualizado com sucesso`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error('❌ Erro ao atualizar registro:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dados inválidos' }));
            }
        });
        return;
    }

    // GET /api/maintenance/metrics - Get Maintenance Metrics
    if (path === '/api/maintenance/metrics' && method === 'GET') {
        console.log('✅ GET /api/maintenance/metrics - Buscando métricas de manutenção');
        
        const metrics = {
            totalEquipment: 13,
            operationalEquipment: 10,
            maintenanceEquipment: 1,
            brokenEquipment: 2,
            totalMaintenanceRecords: 21,
            scheduledMaintenance: 3,
            inProgressMaintenance: 1,
            completedMaintenance: 3,
            totalMaintenanceCosts: 2920.00,
            averageMaintenanceCost: 417.14,
            monthlyMaintenanceCosts: [
                { month: 'Jan', cost: 850.00, description: 'Manutenção preventiva equipamentos de teste' },
                { month: 'Fev', cost: 1240.00, description: 'Atualizações de firmware e calibrações' },
                { month: 'Mar', cost: 830.00, description: 'Reparos corretivos diversos' }
            ],
            maintenanceByType: {
                preventive: 4,
                corrective: 3
            },
            equipmentByTeam: {
                'quality-components': { total: 3, operational: 2, maintenance: 1, broken: 0 },
                'assembly-a': { total: 3, operational: 3, maintenance: 0, broken: 0 },
                'assembly-b': { total: 3, operational: 2, maintenance: 0, broken: 1 },
                'packaging': { total: 2, operational: 2, maintenance: 0, broken: 0 },
                'maintenance': { total: 2, operational: 2, maintenance: 0, broken: 0 }
            },
            criticalEquipment: [
                { name: 'Rack de Testes Múltiplos Simultâneos', status: 'broken', impact: 'Alto' },
                { name: 'Estação de Validação de Placas-Mãe', status: 'maintenance', impact: 'Médio' }
            ],
            equipmentUptime: 89.2, // porcentagem (menor devido ao foco em qualidade)
            mtbf: 1440, // Mean Time Between Failures (horas) - equipamentos eletrônicos são mais confiáveis
            mttr: 2.8, // Mean Time To Repair (horas) - reparos mais rápidos em eletrônicos
            productionImpact: {
                currentCapacity: 85, // % da capacidade total
                affectedTeams: ['assembly-b'], // times afetados por equipamentos quebrados
                estimatedLoss: 12.5 // % de perda de produtividade
            }
        };
        
        const responseData = {
            success: true,
            data: metrics,
            timestamp: new Date().toISOString()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData, null, 2));
        return;
    }

    // Rota não encontrada
    console.log(`❌ 404 - Rota não encontrada: ${method} ${path}`);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
});

server.listen(PORT, () => {
    console.log(`
🚀 ================================================
   SERVIDOR BÁSICO MRP2 BACKEND INICIADO
   Porta: ${PORT}
   URL: http://localhost:${PORT}
   
   Endpoints disponíveis:
   🔐 AUTENTICAÇÃO:
   - POST /api/auth/login
   - POST /api/auth/register  
   - POST /api/auth/verify-email
   - PUT  /api/auth/reset-password
   - PUT  /api/auth/change-password
   
   👥 EQUIPES:
   - GET  /api/orders/teams
   - POST /api/orders/teams
   
   💰 FINANCEIRO:
   - GET  /api/financial
   - PUT  /api/financial
   - GET  /api/financial/cpu-sales
   
   📦 INVENTÁRIO:
   - GET  /api/inventory/items
   - GET  /api/inventory/tools
   
   📋 PEDIDOS:
   - GET  /api/orders
   - GET  /api/orders/cpu-types
   
   🔍 QUALIDADE:
   - GET  /api/quality/reports
   - PUT  /api/quality/reports/:id/resolve
   - GET  /api/quality/metrics
   
   🔧 MANUTENÇÃO:
   - GET  /api/maintenance/equipment
   - POST /api/maintenance/equipment
   - PUT  /api/maintenance/equipment/:id
   - DEL  /api/maintenance/equipment/:id
   - GET  /api/maintenance/records
   - POST /api/maintenance/records
   - PUT  /api/maintenance/records/:id
   - GET  /api/maintenance/metrics
   
   ⚡ SISTEMA:
   - GET  /health
   - GET  /api/hello
================================================ 🚀
    `);
});

server.on('error', (error) => {
    console.error('❌ Erro no servidor:', error);
}); 