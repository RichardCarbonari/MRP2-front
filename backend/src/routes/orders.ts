import { Router } from 'express';

const router = Router();

// Tipos de CPU disponíveis
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
            processor: 'Intel Core i7-13700F',
            motherboard: 'ASUS ROG STRIX B660-F GAMING WiFi',
            ram: 'Corsair Vengeance LPX 32GB DDR4',
            storage: 'Samsung 980 PRO 2TB NVMe',
            gpu: 'NVIDIA GeForce RTX 4070 Ti',
            powerSupply: 'Corsair RM750x 750W 80 Plus Gold',
            case: 'NZXT H5 Flow'
        }
    },
    'workstation': {
        name: 'Workstation',
        price: 3800,
        specs: {
            processor: 'Intel Core i7-13700',
            motherboard: 'ASUS ProArt B660-CREATOR D4',
            ram: 'Corsair Vengeance LPX 64GB DDR4',
            storage: 'Samsung 980 PRO 1TB NVMe',
            gpu: 'NVIDIA RTX A4000',
            powerSupply: 'Corsair RM850x 850W 80 Plus Gold',
            case: 'Fractal Design Define 7'
        }
    },
    'office': {
        name: 'Office/Corporativo',
        price: 1800,
        specs: {
            processor: 'Intel Core i5-13400',
            motherboard: 'ASUS PRIME B660M-A D4',
            ram: 'Corsair Vengeance LPX 16GB DDR4',
            storage: 'Kingston NV2 512GB NVMe',
            powerSupply: 'Corsair CV450 450W 80 Plus Bronze',
            case: 'Cooler Master MasterBox Q300L'
        }
    },
    'budget': {
        name: 'Entrada/Budget',
        price: 1200,
        specs: {
            processor: 'Intel Core i3-13100',
            motherboard: 'ASUS PRIME H610M-E D4',
            ram: 'Kingston FURY Beast 8GB DDR4',
            storage: 'Kingston NV2 256GB NVMe',
            powerSupply: 'Corsair CV350 350W',
            case: 'Cooler Master MasterBox Q300L'
        }
    }
};

// Mock database for orders
let orders = [
    {
        id: 'PED001',
        customerName: 'João Silva',
        customerEmail: 'joao.silva@email.com',
        customerPhone: '(11) 99999-9999',
        cpuType: 'gaming-basic',
        cpuSpecs: cpuTypes['gaming-basic'].specs,
        quantity: 2,
        unitPrice: cpuTypes['gaming-basic'].price,
        totalPrice: cpuTypes['gaming-basic'].price * 2,
        orderDate: '2024-12-20T10:00:00.000Z',
        deliveryDate: '2024-12-27T10:00:00.000Z',
        status: 'assembly',
        priority: 'high',
        notes: 'Cliente solicitou montagem expressa',
        createdAt: '2024-12-20T10:00:00.000Z',
        updatedAt: '2024-12-20T10:00:00.000Z'
    },
    {
        id: 'PED002',
        customerName: 'Maria Santos',
        customerEmail: 'maria.santos@empresa.com',
        customerPhone: '(11) 88888-8888',
        cpuType: 'workstation',
        cpuSpecs: cpuTypes['workstation'].specs,
        quantity: 1,
        unitPrice: cpuTypes['workstation'].price,
        totalPrice: cpuTypes['workstation'].price,
        orderDate: '2024-12-21T09:00:00.000Z',
        deliveryDate: '2024-12-30T09:00:00.000Z',
        status: 'pending',
        priority: 'medium',
        notes: 'Para uso em arquitetura e renderização',
        createdAt: '2024-12-21T09:00:00.000Z',
        updatedAt: '2024-12-21T09:00:00.000Z'
    },
    {
        id: 'PED003',
        customerName: 'Pedro Costa',
        customerEmail: 'pedro.costa@email.com',
        customerPhone: '(11) 77777-7777',
        cpuType: 'gaming-advanced',
        cpuSpecs: cpuTypes['gaming-advanced'].specs,
        quantity: 1,
        unitPrice: cpuTypes['gaming-advanced'].price,
        totalPrice: cpuTypes['gaming-advanced'].price,
        orderDate: '2024-12-19T15:00:00.000Z',
        deliveryDate: '2024-12-26T15:00:00.000Z',
        status: 'testing',
        priority: 'high',
        notes: 'Configuração personalizada com overclock',
        createdAt: '2024-12-19T15:00:00.000Z',
        updatedAt: '2024-12-19T15:00:00.000Z'
    },
    {
        id: 'PED004',
        customerName: 'Ana Carolina',
        customerEmail: 'ana.carolina@tech.com.br',
        customerPhone: '(11) 66666-6666',
        cpuType: 'office',
        cpuSpecs: cpuTypes['office'].specs,
        quantity: 5,
        unitPrice: cpuTypes['office'].price,
        totalPrice: cpuTypes['office'].price * 5,
        orderDate: '2024-12-22T08:30:00.000Z',
        deliveryDate: '2025-01-05T08:30:00.000Z',
        status: 'pending',
        priority: 'low',
        notes: 'Pedido corporativo para escritório - 5 estações de trabalho',
        createdAt: '2024-12-22T08:30:00.000Z',
        updatedAt: '2024-12-22T08:30:00.000Z'
    },
    {
        id: 'PED005',
        customerName: 'Ricardo Mendes',
        customerEmail: 'ricardo.mendes@gamer.com',
        customerPhone: '(11) 55555-5555',
        cpuType: 'gaming-advanced',
        cpuSpecs: cpuTypes['gaming-advanced'].specs,
        quantity: 1,
        unitPrice: cpuTypes['gaming-advanced'].price,
        totalPrice: cpuTypes['gaming-advanced'].price,
        orderDate: '2024-12-21T14:00:00.000Z',
        deliveryDate: '2024-12-28T14:00:00.000Z',
        status: 'ready',
        priority: 'high',
        notes: 'Setup para streaming profissional - RGB customizado',
        createdAt: '2024-12-21T14:00:00.000Z',
        updatedAt: '2024-12-22T16:30:00.000Z'
    },
    {
        id: 'PED006',
        customerName: 'Fernanda Oliveira',
        customerEmail: 'fernanda.oliveira@estudante.com',
        customerPhone: '(11) 44444-4444',
        cpuType: 'budget',
        cpuSpecs: cpuTypes['budget'].specs,
        quantity: 2,
        unitPrice: cpuTypes['budget'].price,
        totalPrice: cpuTypes['budget'].price * 2,
        orderDate: '2024-12-20T11:15:00.000Z',
        deliveryDate: '2024-12-29T11:15:00.000Z',
        status: 'assembly',
        priority: 'medium',
        notes: 'PCs para estudos universitários - orçamento limitado',
        createdAt: '2024-12-20T11:15:00.000Z',
        updatedAt: '2024-12-22T10:45:00.000Z'
    },
    {
        id: 'PED007',
        customerName: 'Lucas Technologies LTDA',
        customerEmail: 'compras@lucastech.com.br',
        customerPhone: '(11) 33333-3333',
        cpuType: 'workstation',
        cpuSpecs: cpuTypes['workstation'].specs,
        quantity: 3,
        unitPrice: cpuTypes['workstation'].price,
        totalPrice: cpuTypes['workstation'].price * 3,
        orderDate: '2024-12-18T16:45:00.000Z',
        deliveryDate: '2025-01-02T16:45:00.000Z',
        status: 'delivered',
        priority: 'medium',
        notes: 'Estações para equipe de design gráfico - entrega realizada',
        createdAt: '2024-12-18T16:45:00.000Z',
        updatedAt: '2024-12-24T09:00:00.000Z'
    }
];

// Função para gerar ID único
const generateOrderId = () => {
    const lastOrder = orders.sort((a, b) => parseInt(b.id.slice(3)) - parseInt(a.id.slice(3)))[0];
    const lastNumber = lastOrder ? parseInt(lastOrder.id.slice(3)) : 0;
    return `PED${String(lastNumber + 1).padStart(3, '0')}`;
};

// GET /api/orders - Buscar todos os pedidos
// ROTAS ESPECÍFICAS DEVEM VIR ANTES DAS GENÉRICAS

router.get('/cpu-types', (req, res) => {
    try {
        console.log('GET /api/orders/cpu-types - Buscando tipos de CPU');
        res.json(cpuTypes);
    } catch (error) {
        console.error('Erro ao buscar tipos de CPU:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/stats/summary', (req, res) => {
    try {
        res.json({ message: 'Stats endpoint working' });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/', (req, res) => {
    try {
        console.log('GET /api/orders - Buscando todos os pedidos');
        res.json(orders);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const order = orders.find(o => o.id === id);
        
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        
        res.json(order);
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/orders - Criar novo pedido
router.post('/', (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            cpuType,
            quantity,
            deliveryDate,
            priority,
            notes
        } = req.body;
        
        // Validações
        if (!customerName || !customerEmail || !customerPhone || !cpuType || !quantity || !deliveryDate) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }
        
        if (!cpuTypes[cpuType as keyof typeof cpuTypes]) {
            return res.status(400).json({ error: 'Tipo de CPU inválido' });
        }
        
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantidade deve ser maior que zero' });
        }
        
        // Verificar se a data de entrega é futura
        const deliveryDateObj = new Date(deliveryDate);
        if (deliveryDateObj <= new Date()) {
            return res.status(400).json({ error: 'Data de entrega deve ser futura' });
        }
        
        const selectedCpuType = cpuTypes[cpuType as keyof typeof cpuTypes];
        const unitPrice = selectedCpuType.price;
        const totalPrice = unitPrice * quantity;
        
        const newOrder = {
            id: generateOrderId(),
            customerName,
            customerEmail,
            customerPhone,
            cpuType,
            cpuSpecs: selectedCpuType.specs,
            quantity,
            unitPrice,
            totalPrice,
            orderDate: new Date().toISOString(),
            deliveryDate: deliveryDateObj.toISOString(),
            status: 'pending' as const,
            priority: priority || 'medium',
            notes: notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// PUT /api/orders/:id - Atualizar pedido
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const orderIndex = orders.findIndex(o => o.id === id);
        
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        
        const {
            customerName,
            customerEmail,
            customerPhone,
            cpuType,
            quantity,
            deliveryDate,
            status,
            priority,
            notes
        } = req.body;
        
        const currentOrder = orders[orderIndex];
        
        // Atualizar apenas campos fornecidos
        if (customerName !== undefined) currentOrder.customerName = customerName;
        if (customerEmail !== undefined) currentOrder.customerEmail = customerEmail;
        if (customerPhone !== undefined) currentOrder.customerPhone = customerPhone;
        if (deliveryDate !== undefined) {
            const deliveryDateObj = new Date(deliveryDate);
            if (deliveryDateObj <= new Date()) {
                return res.status(400).json({ error: 'Data de entrega deve ser futura' });
            }
            currentOrder.deliveryDate = deliveryDateObj.toISOString();
        }
        if (status !== undefined) currentOrder.status = status;
        if (priority !== undefined) currentOrder.priority = priority;
        if (notes !== undefined) currentOrder.notes = notes;
        
        // Se mudou o tipo de CPU ou quantidade, recalcular preços
        if (cpuType !== undefined || quantity !== undefined) {
            const newCpuType = cpuType || currentOrder.cpuType;
            const newQuantity = quantity || currentOrder.quantity;
            
            if (!cpuTypes[newCpuType as keyof typeof cpuTypes]) {
                return res.status(400).json({ error: 'Tipo de CPU inválido' });
            }
            
            if (newQuantity <= 0) {
                return res.status(400).json({ error: 'Quantidade deve ser maior que zero' });
            }
            
            const selectedCpuType = cpuTypes[newCpuType as keyof typeof cpuTypes];
            currentOrder.cpuType = newCpuType;
            currentOrder.cpuSpecs = selectedCpuType.specs;
            currentOrder.quantity = newQuantity;
            currentOrder.unitPrice = selectedCpuType.price;
            currentOrder.totalPrice = selectedCpuType.price * newQuantity;
        }
        
        currentOrder.updatedAt = new Date().toISOString();
        
        res.json(currentOrder);
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE /api/orders/:id - Deletar pedido
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const orderIndex = orders.findIndex(o => o.id === id);
        
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        
        // Não permitir deletar pedidos em produção ou entregues
        const order = orders[orderIndex];
        if (order.status === 'assembly' || order.status === 'testing' || order.status === 'delivered') {
            return res.status(400).json({ 
                error: 'Não é possível deletar pedidos em produção ou já entregues' 
            });
        }
        
        orders.splice(orderIndex, 1);
        
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/orders/stats/summary - Estatísticas dos pedidos
router.get('/stats/summary', (req, res) => {
    try {
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const inProgressOrders = orders.filter(o => o.status === 'assembly' || o.status === 'testing').length;
        const completedOrders = orders.filter(o => o.status === 'delivered').length;
        const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalPrice, 0);
        const averageOrderValue = totalOrders > 0 ? orders.reduce((sum, o) => sum + o.totalPrice, 0) / totalOrders : 0;
        
        // Pedidos por prioridade
        const highPriority = orders.filter(o => o.priority === 'high').length;
        const mediumPriority = orders.filter(o => o.priority === 'medium').length;
        const lowPriority = orders.filter(o => o.priority === 'low').length;
        
        // Produtos mais vendidos
        const productStats = Object.keys(cpuTypes).map(cpuType => {
            const typeOrders = orders.filter(o => o.cpuType === cpuType);
            const totalQuantity = typeOrders.reduce((sum, o) => sum + o.quantity, 0);
            const totalValue = typeOrders.reduce((sum, o) => sum + o.totalPrice, 0);
            
            return {
                cpuType,
                name: cpuTypes[cpuType as keyof typeof cpuTypes].name,
                orderCount: typeOrders.length,
                totalQuantity,
                totalValue
            };
        }).sort((a, b) => b.totalValue - a.totalValue);
        
        res.json({
            summary: {
                totalOrders,
                pendingOrders,
                inProgressOrders,
                completedOrders,
                totalRevenue,
                averageOrderValue
            },
            priorities: {
                high: highPriority,
                medium: mediumPriority,
                low: lowPriority
            },
            topProducts: productStats.slice(0, 5)
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/orders/cpu-types - Buscar tipos de CPU disponíveis
router.get('/cpu-types', (req, res) => {
    try {
        res.json(cpuTypes);
    } catch (error) {
        console.error('Erro ao buscar tipos de CPU:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Teams Management endpoints
router.get('/teams', (req, res) => {
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
            tasks: [
                {
                    id: 'task-1',
                    orderId: 'PED001',
                    cpuType: 'Gaming Básico',
                    components: ['Processador Intel i5', 'Placa-mãe B450', 'RAM 16GB DDR4'],
                    priority: 'alta',
                    status: 'em_andamento',
                    assignedMember: 'Maria Qualidade',
                    estimatedTime: 2,
                    notes: 'Verificar compatibilidade da placa-mãe',
                    createdAt: new Date().toISOString()
                }
            ],
            members: [
                {
                    id: 1,
                    name: 'Maria Qualidade',
                    role: 'Líder de Qualidade',
                    level: 'lead',
                    skills: ['Inspeção Visual', 'Testes Funcionais', 'Validação', 'Gestão'],
                    availability: true,
                    currentProject: 'Verificação lote processadores',
                    efficiency: 98,
                    email: 'maria.qualidade@email.com',
                    phone: '(11) 99876-5432',
                    joinDate: '2022-08-15'
                },
                {
                    id: 2,
                    name: 'Carlos Inspetor',
                    role: 'Inspetor de Componentes',
                    level: 'senior',
                    skills: ['Microscópio Digital', 'Testes Elétricos', 'Controle de Qualidade'],
                    availability: false,
                    currentProject: 'Inspeção placas-mãe',
                    efficiency: 94,
                    email: 'carlos.qualidade@email.com',
                    phone: '(11) 98765-4321',
                    joinDate: '2023-01-20'
                },
                {
                    id: 3,
                    name: 'Ana Validadora',
                    role: 'Técnica de Validação',
                    level: 'pleno',
                    skills: ['Validação de Specs', 'Testes de Componentes', 'Documentação'],
                    availability: true,
                    efficiency: 92,
                    email: 'ana.qualidade@email.com',
                    phone: '(11) 97654-3210',
                    joinDate: '2023-04-10'
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
                    role: 'Líder de Montagem',
                    level: 'lead',
                    skills: ['Montagem Avançada', 'Water Cooling', 'Gestão de Equipe', 'Troubleshooting'],
                    availability: true,
                    currentProject: 'PED003 - Gaming Avançado',
                    efficiency: 96,
                    email: 'joao.montagema@email.com',
                    phone: '(11) 99876-1234',
                    joinDate: '2022-05-10'
                },
                {
                    id: 5,
                    name: 'Roberto Montador',
                    role: 'Montador Sênior',
                    level: 'senior',
                    skills: ['Montagem de Placas', 'Instalação de Coolers', 'Cable Management'],
                    availability: false,
                    currentProject: 'PED001 - Gaming Básico',
                    efficiency: 91,
                    email: 'roberto.montagema@email.com',
                    phone: '(11) 98765-2345',
                    joinDate: '2023-02-15'
                },
                {
                    id: 6,
                    name: 'Fernanda Hardware',
                    role: 'Montadora Pleno',
                    level: 'pleno',
                    skills: ['Montagem Básica', 'Testes de Hardware', 'Controle de Qualidade'],
                    availability: true,
                    efficiency: 89,
                    email: 'fernanda.montagema@email.com',
                    phone: '(11) 97654-3456',
                    joinDate: '2023-06-20'
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
                    role: 'Líder de Software',
                    level: 'lead',
                    skills: ['Instalação de SO', 'Configuração de Drivers', 'Testes de Software', 'Gestão'],
                    availability: true,
                    currentProject: 'PED002 - Workstation',
                    efficiency: 95,
                    email: 'pedro.montagemb@email.com',
                    phone: '(11) 99876-7890',
                    joinDate: '2022-09-12'
                },
                {
                    id: 8,
                    name: 'Sofia Software',
                    role: 'Especialista em SO',
                    level: 'senior',
                    skills: ['Windows/Linux', 'Drivers', 'Benchmark de Software', 'Configurações'],
                    availability: true,
                    efficiency: 93,
                    email: 'sofia.montagemb@email.com',
                    phone: '(11) 98765-8901',
                    joinDate: '2023-01-08'
                },
                {
                    id: 9,
                    name: 'Lucas Tester',
                    role: 'Técnico de Testes',
                    level: 'pleno',
                    skills: ['Testes de Software', 'Validação de Performance', 'Relatórios'],
                    availability: false,
                    currentProject: 'Teste lote corporativo',
                    efficiency: 87,
                    email: 'lucas.montagemb@email.com',
                    phone: '(11) 97654-9012',
                    joinDate: '2023-07-22'
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
                    role: 'Líder de Empacotamento',
                    level: 'lead',
                    skills: ['Gestão de Embalagem', 'Controle de Qualidade Final', 'Logística'],
                    availability: true,
                    currentProject: 'Preparação envio lote',
                    efficiency: 97,
                    email: 'sandra.empacotamento@email.com',
                    phone: '(11) 99876-3333',
                    joinDate: '2022-11-20'
                },
                {
                    id: 11,
                    name: 'Carlos Pacote',
                    role: 'Especialista em Embalagem',
                    level: 'senior',
                    skills: ['Embalagem Segura', 'Etiquetagem', 'Controle de Inventário'],
                    availability: true,
                    efficiency: 92,
                    email: 'carlos.empacotamento@email.com',
                    phone: '(11) 98765-4444',
                    joinDate: '2023-03-15'
                },
                {
                    id: 12,
                    name: 'Julia Expedição',
                    role: 'Auxiliar de Expedição',
                    level: 'pleno',
                    skills: ['Preparação de Envio', 'Documentação', 'Organização'],
                    availability: false,
                    currentProject: 'Organização estoque',
                    efficiency: 89,
                    email: 'julia.empacotamento@email.com',
                    phone: '(11) 97654-5555',
                    joinDate: '2023-08-05'
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
                    role: 'Líder de Manutenção',
                    level: 'lead',
                    skills: ['Manutenção Preventiva', 'Manutenção Corretiva', 'Gestão de Peças', 'Gestão'],
                    availability: true,
                    efficiency: 94,
                    email: 'ricardo.manutencao@email.com',
                    phone: '(11) 99876-6666',
                    joinDate: '2022-07-08'
                },
                {
                    id: 14,
                    name: 'Bruno Técnico',
                    role: 'Técnico de Manutenção',
                    level: 'senior',
                    skills: ['Manutenção Elétrica', 'Calibração', 'Diagnóstico de Equipamentos'],
                    availability: true,
                    efficiency: 86,
                    email: 'bruno.manutencao@email.com',
                    phone: '(11) 98765-7777',
                    joinDate: '2023-02-28'
                },
                {
                    id: 15,
                    name: 'Marcos Auxiliar',
                    role: 'Auxiliar de Manutenção',
                    level: 'junior',
                    skills: ['Limpeza de Equipamentos', 'Organização de Ferramentas', 'Apoio Técnico'],
                    availability: true,
                    efficiency: 82,
                    email: 'marcos.manutencao@email.com',
                    phone: '(11) 97654-8888',
                    joinDate: '2023-09-10'
                }
            ]
        }
    ];

    res.json(teams);
});

// Create new team
router.post('/teams', (req, res) => {
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
router.put('/teams/:id', (req, res) => {
    console.log(`✅ PUT /api/orders/teams/${req.params.id} - Atualizando equipe`);
    const updatedTeam = {
        id: req.params.id,
        ...req.body
    };
    
    res.json(updatedTeam);
});

// Delete team
router.delete('/teams/:id', (req, res) => {
    console.log(`✅ DELETE /api/orders/teams/${req.params.id} - Deletando equipe`);
    res.json({ message: 'Equipe deletada com sucesso' });
});

// Add member to team
router.post('/teams/:id/members', (req, res) => {
    console.log(`✅ POST /api/orders/teams/${req.params.id}/members - Adicionando membro`);
    const newMember = {
        id: Date.now(),
        ...req.body,
        joinDate: new Date().toISOString(),
        availability: true,
        efficiency: Math.floor(Math.random() * 15) + 85 // 85-99%
    };
    
    res.status(201).json(newMember);
});

// Update task status
router.put('/teams/:teamId/tasks/:taskId', (req, res) => {
    console.log(`✅ PUT /api/orders/teams/${req.params.teamId}/tasks/${req.params.taskId} - Atualizando status da tarefa`);
    const updatedTask = {
        id: req.params.taskId,
        ...req.body
    };
    
    res.json(updatedTask);
});

// Add task to team
router.post('/teams/:id/tasks', (req, res) => {
    console.log(`✅ POST /api/orders/teams/${req.params.id}/tasks - Adicionando tarefa`);
    const newTask = {
        id: `task-${Date.now()}`,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newTask);
});

export default router; 
