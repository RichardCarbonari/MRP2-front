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
                },
                monthlyTrend: '+12%',
                customerSatisfaction: 4.6,
                status: 'Excelente'
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
                },
                monthlyTrend: '+8%',
                customerSatisfaction: 4.8,
                status: 'Excelente'
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
                },
                monthlyTrend: '+15%',
                customerSatisfaction: 4.7,
                status: 'Excelente'
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
                },
                monthlyTrend: '+25%',
                customerSatisfaction: 4.4,
                status: 'Bom'
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
                },
                monthlyTrend: '+18%',
                customerSatisfaction: 4.2,
                status: 'Bom'
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

    // GET /api/hello - Rota de teste
    if (path === '/api/hello' && method === 'GET') {
        console.log('✅ GET /api/hello - Teste de conectividade');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Backend funcionando!', timestamp: new Date().toISOString() }));
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
   - GET  /api/hello
   - GET  /api/orders/teams
   - POST /api/orders/teams
================================================ 🚀
    `);
});

server.on('error', (error) => {
    console.error('❌ Erro no servidor:', error);
}); 