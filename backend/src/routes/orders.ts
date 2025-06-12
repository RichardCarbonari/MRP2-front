/**
 * 🛒 ROTAS DE PEDIDOS - Sistema de Gestão de Vendas
 * 
 * Este arquivo contém todas as rotas relacionadas ao gerenciamento de pedidos:
 * - Listagem de pedidos com dados do banco
 * - Criação de novos pedidos com validações
 * - Atualização de pedidos existentes
 * - Exclusão de pedidos
 * - Busca de tipos de CPU disponíveis
 * - Estatísticas e métricas de vendas
 * 
 * Todas as operações são realizadas diretamente no banco de dados SQLite
 * através do Prisma ORM, garantindo persistência e integridade dos dados.
 */

import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * 🖥️ GET /api/orders/cpu-types
 * 
 * Busca todos os tipos de CPU disponíveis no catálogo de produtos.
 * Retorna apenas produtos ativos da categoria 'CPU' com suas especificações.
 * 
 * Resposta: Objeto com IDs como chaves e dados dos produtos como valores
 * Exemplo: { "uuid-123": { name: "Intel i9", price: 3000, specs: {...} } }
 */
router.get('/cpu-types', async (req, res) => {
    try {
        console.log('🔍 Buscando tipos de CPU disponíveis...');
        
        // Buscar apenas CPUs ativas no banco de dados
        const cpuTypes = await prisma.product.findMany({
            where: {
                category: 'CPU',    // Filtrar apenas CPUs
                isActive: true      // Apenas produtos ativos
            },
            select: {
                id: true,
                name: true,
                price: true,
                specifications: true
            }
        });

        // Transformar array em objeto para compatibilidade com frontend
        const formattedTypes = cpuTypes.reduce((acc, cpu) => {
            acc[cpu.id] = {
                name: cpu.name,
                price: cpu.price,
                specs: cpu.specifications as any
            };
            return acc;
        }, {} as Record<string, any>);

        console.log(`✅ Encontrados ${cpuTypes.length} tipos de CPU`);
        res.json(formattedTypes);
    } catch (error) {
        console.error('❌ Erro ao buscar tipos de CPU:', error);
        res.status(500).json({ message: 'Erro ao buscar tipos de CPU' });
    }
});

/**
 * 📊 GET /api/orders/stats/summary
 * 
 * Retorna estatísticas resumidas dos pedidos para dashboards.
 * Inclui contadores por status, receita total e valor médio dos pedidos.
 * 
 * Resposta: Objeto com métricas agregadas do sistema
 */
router.get('/stats/summary', async (req, res) => {
    try {
        console.log('📊 Calculando estatísticas dos pedidos...');
        
        // Contar pedidos por status
        const totalOrders = await prisma.order.count();
        const pendingOrders = await prisma.order.count({ where: { status: 'pending' } });
        const processingOrders = await prisma.order.count({ where: { status: 'processing' } });
        const deliveredOrders = await prisma.order.count({ where: { status: 'delivered' } });
        
        // Calcular métricas financeiras
        const revenueData = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            _avg: { totalAmount: true }
        });

        const stats = {
            summary: {
                totalOrders,
                pendingOrders,
                inProgressOrders: processingOrders,
                completedOrders: deliveredOrders,
                totalRevenue: revenueData._sum.totalAmount || 0,
                averageOrderValue: revenueData._avg.totalAmount || 0
            }
        };

        console.log(`✅ Estatísticas calculadas: ${totalOrders} pedidos, R$ ${(revenueData._sum.totalAmount || 0).toFixed(2)} em receita`);
        res.json(stats);
    } catch (error) {
        console.error('❌ Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

/**
 * 📋 GET /api/orders
 * 
 * Lista todos os pedidos do sistema com informações completas.
 * Inclui dados do cliente, produtos, valores e status.
 * Os dados são buscados diretamente do banco com joins otimizados.
 * 
 * Resposta: Array de pedidos formatados para o frontend
 */
router.get('/', async (req, res) => {
    try {
        console.log('📋 Buscando todos os pedidos do banco de dados...');
        
        // Buscar pedidos com relacionamentos (produtos incluídos)
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true  // Incluir dados completos do produto
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'  // Mais recentes primeiro
            }
        });

        // Transformar dados do banco para formato esperado pelo frontend
        const formattedOrders = orders.map(order => {
            const firstItem = order.items[0];  // Assumindo um produto por pedido
            const product = firstItem?.product;
            
            return {
                id: order.orderNumber,                    // Usar número do pedido como ID
                customerName: order.customerName,
                customerEmail: order.customerEmail || '',
                customerPhone: order.customerPhone || '',
                cpuType: product?.id || '',               // ID do produto
                cpuSpecs: product?.specifications as any || {},
                quantity: firstItem?.quantity || 0,
                unitPrice: firstItem?.unitPrice || 0,
                totalPrice: order.totalAmount,
                orderDate: order.createdAt.toISOString(),
                deliveryDate: order.deliveredAt?.toISOString() || 
                             new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 dias se não definido
                status: order.status as 'pending' | 'assembly' | 'testing' | 'ready' | 'delivered',
                priority: 'medium' as 'high' | 'medium' | 'low', // Prioridade padrão
                notes: '',
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString()
            };
        });

        console.log(`✅ Retornando ${formattedOrders.length} pedidos`);
        res.json(formattedOrders);
    } catch (error) {
        console.error('❌ Erro ao buscar pedidos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

/**
 * ➕ POST /api/orders
 * 
 * Cria um novo pedido no sistema com validações completas.
 * Calcula automaticamente preços, custos e lucros.
 * Gera número sequencial do pedido e associa a um usuário admin.
 * 
 * Body: Dados do cliente, produto, quantidade e data de entrega
 * Resposta: Pedido criado com todos os cálculos realizados
 */
router.post('/', async (req, res) => {
    try {
        console.log('➕ Criando novo pedido...');
        
        const {
            customerName,
            customerEmail,
            customerPhone,
            cpuType,        // ID do produto
            quantity,
            deliveryDate,
            priority,
            notes
        } = req.body;
        
        // 🔍 VALIDAÇÕES DE ENTRADA
        if (!customerName || !customerEmail || !customerPhone || !cpuType || !quantity || !deliveryDate) {
            console.log('❌ Campos obrigatórios faltando');
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }
        
        // Buscar produto no catálogo
        const product = await prisma.product.findUnique({
            where: { id: cpuType }
        });
        
        if (!product) {
            console.log('❌ Produto não encontrado:', cpuType);
            return res.status(400).json({ error: 'Tipo de CPU inválido' });
        }
        
        if (quantity <= 0) {
            console.log('❌ Quantidade inválida:', quantity);
            return res.status(400).json({ error: 'Quantidade deve ser maior que zero' });
        }
        
        // Validar data de entrega
        const deliveryDateObj = new Date(deliveryDate);
        if (deliveryDateObj <= new Date()) {
            console.log('❌ Data de entrega no passado');
            return res.status(400).json({ error: 'Data de entrega deve ser futura' });
        }

        // Buscar usuário admin para associar ao pedido
        const adminUser = await prisma.user.findFirst({
            where: { role: 'admin' }
        });

        if (!adminUser) {
            console.log('❌ Usuário admin não encontrado');
            return res.status(500).json({ error: 'Usuário admin não encontrado' });
        }
        
        // 💰 CÁLCULOS FINANCEIROS
        const unitPrice = product.price;
        const unitCost = product.cost;
        const totalAmount = unitPrice * quantity;      // Receita total
        const totalCost = unitCost * quantity;         // Custo total
        const profitAmount = totalAmount - totalCost;  // Lucro

        // Gerar número sequencial do pedido
        const orderCount = await prisma.order.count();
        const orderNumber = `ORD-2024-${String(orderCount + 1).padStart(3, '0')}`;
        
        console.log(`💰 Cálculos: Receita R$ ${totalAmount}, Custo R$ ${totalCost}, Lucro R$ ${profitAmount}`);
        
        // 💾 CRIAR PEDIDO NO BANCO
        const newOrder = await prisma.order.create({
            data: {
                orderNumber,
                customerName,
                customerEmail,
                customerPhone,
                status: 'pending',
                totalAmount,
                totalCost,
                profitAmount,
                createdBy: adminUser.id,
                deliveredAt: deliveryDateObj,
                items: {
                    create: {  // Criar item do pedido simultaneamente
                        productId: product.id,
                        quantity,
                        unitPrice,
                        unitCost,
                        subtotal: totalAmount,
                        profit: profitAmount
                    }
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Formatar resposta para o frontend
        const firstItem = newOrder.items[0];
        const formattedOrder = {
            id: newOrder.orderNumber,
            customerName: newOrder.customerName,
            customerEmail: newOrder.customerEmail || '',
            customerPhone: newOrder.customerPhone || '',
            cpuType: product.id,
            cpuSpecs: product.specifications as any,
            quantity: firstItem.quantity,
            unitPrice: firstItem.unitPrice,
            totalPrice: newOrder.totalAmount,
            orderDate: newOrder.createdAt.toISOString(),
            deliveryDate: deliveryDateObj.toISOString(),
            status: newOrder.status as 'pending' | 'assembly' | 'testing' | 'ready' | 'delivered',
            priority: priority || 'medium',
            notes: notes || '',
            createdAt: newOrder.createdAt.toISOString(),
            updatedAt: newOrder.updatedAt.toISOString()
        };
        
        console.log(`✅ Pedido criado: ${orderNumber} - ${customerName} - R$ ${totalAmount}`);
        res.status(201).json(formattedOrder);
    } catch (error) {
        console.error('❌ Erro ao criar pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

/**
 * ✏️ PUT /api/orders/:id
 * 
 * Atualiza um pedido existente no sistema.
 * Permite modificar dados do cliente, produto, quantidade e status.
 * Recalcula automaticamente valores quando produto/quantidade mudam.
 * 
 * Params: id - Número do pedido (orderNumber)
 * Body: Campos a serem atualizados
 * Resposta: Pedido atualizado com novos cálculos
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Número do pedido
        console.log(`✏️ Atualizando pedido ${id}...`);
        
        // Buscar pedido existente pelo número
        const existingOrder = await prisma.order.findFirst({
            where: { orderNumber: id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        
        if (!existingOrder) {
            console.log('❌ Pedido não encontrado:', id);
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
        
        let updateData: any = {};
        let itemUpdateData: any = {};
        let needsItemUpdate = false;
        
        // 📝 ATUALIZAR CAMPOS BÁSICOS DO PEDIDO
        if (customerName !== undefined) updateData.customerName = customerName;
        if (customerEmail !== undefined) updateData.customerEmail = customerEmail;
        if (customerPhone !== undefined) updateData.customerPhone = customerPhone;
        if (status !== undefined) updateData.status = status;
        
        if (deliveryDate !== undefined) {
            const deliveryDateObj = new Date(deliveryDate);
            if (deliveryDateObj <= new Date()) {
                return res.status(400).json({ error: 'Data de entrega deve ser futura' });
            }
            updateData.deliveredAt = deliveryDateObj;
        }
        
        // 💰 RECALCULAR VALORES SE PRODUTO/QUANTIDADE MUDARAM
        if (cpuType !== undefined || quantity !== undefined) {
            const newCpuType = cpuType || existingOrder.items[0]?.productId;
            const newQuantity = quantity || existingOrder.items[0]?.quantity;
            
            // Buscar dados do produto
            const product = await prisma.product.findUnique({
                where: { id: newCpuType }
            });
            
            if (!product) {
                return res.status(400).json({ error: 'Tipo de CPU inválido' });
            }
            
            if (newQuantity <= 0) {
                return res.status(400).json({ error: 'Quantidade deve ser maior que zero' });
            }
            
            // Recalcular valores financeiros
            const unitPrice = product.price;
            const unitCost = product.cost;
            const totalAmount = unitPrice * newQuantity;
            const totalCost = unitCost * newQuantity;
            const profitAmount = totalAmount - totalCost;
            
            console.log(`💰 Recalculando: Receita R$ ${totalAmount}, Custo R$ ${totalCost}, Lucro R$ ${profitAmount}`);
            
            // Atualizar dados do pedido
            updateData.totalAmount = totalAmount;
            updateData.totalCost = totalCost;
            updateData.profitAmount = profitAmount;
            
            // Preparar atualização do item
            itemUpdateData = {
                productId: product.id,
                quantity: newQuantity,
                unitPrice,
                unitCost,
                subtotal: totalAmount,
                profit: profitAmount
            };
            needsItemUpdate = true;
        }
        
        // 💾 EXECUTAR ATUALIZAÇÕES NO BANCO
        const updatedOrder = await prisma.order.update({
            where: { id: existingOrder.id },
            data: updateData,
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Atualizar item se necessário
        if (needsItemUpdate && existingOrder.items[0]) {
            await prisma.orderItem.update({
                where: { id: existingOrder.items[0].id },
                data: itemUpdateData
            });
        }

        // Buscar pedido final atualizado
        const finalOrder = await prisma.order.findUnique({
            where: { id: existingOrder.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!finalOrder) {
            return res.status(500).json({ error: 'Erro ao buscar pedido atualizado' });
        }

        // Formatar resposta
        const firstItem = finalOrder.items[0];
        const product = firstItem?.product;
        
        const formattedOrder = {
            id: finalOrder.orderNumber,
            customerName: finalOrder.customerName,
            customerEmail: finalOrder.customerEmail || '',
            customerPhone: finalOrder.customerPhone || '',
            cpuType: product?.id || '',
            cpuSpecs: product?.specifications as any || {},
            quantity: firstItem?.quantity || 0,
            unitPrice: firstItem?.unitPrice || 0,
            totalPrice: finalOrder.totalAmount,
            orderDate: finalOrder.createdAt.toISOString(),
            deliveryDate: finalOrder.deliveredAt?.toISOString() || new Date().toISOString(),
            status: finalOrder.status as 'pending' | 'assembly' | 'testing' | 'ready' | 'delivered',
            priority: priority || 'medium',
            notes: notes || '',
            createdAt: finalOrder.createdAt.toISOString(),
            updatedAt: finalOrder.updatedAt.toISOString()
        };
        
        console.log(`✅ Pedido ${id} atualizado com sucesso`);
        res.json(formattedOrder);
    } catch (error) {
        console.error('❌ Erro ao atualizar pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

/**
 * 🗑️ DELETE /api/orders/:id
 * 
 * Remove um pedido do sistema permanentemente.
 * Os itens do pedido são removidos automaticamente (CASCADE).
 * 
 * Params: id - Número do pedido (orderNumber)
 * Resposta: Status 204 (No Content) em caso de sucesso
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Deletando pedido ${id}...`);
        
        // Buscar pedido pelo número
        const existingOrder = await prisma.order.findFirst({
            where: { orderNumber: id }
        });
        
        if (!existingOrder) {
            console.log('❌ Pedido não encontrado para deleção:', id);
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        
        // Deletar pedido (itens são deletados automaticamente por CASCADE)
        await prisma.order.delete({
            where: { id: existingOrder.id }
        });
        
        console.log(`✅ Pedido ${id} deletado com sucesso`);
        res.status(204).send();
    } catch (error) {
        console.error('❌ Erro ao deletar pedido:', error);
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
        id: 'new-team-id',
        name: 'Nova Equipe',
        description: 'Descrição da nova equipe',
        leader: 'Nome do Líder',
        activeProjects: 0,
        efficiency: 0,
        completedOrders: 0,
        tasks: [],
        members: []
    };

    res.json(newTeam);
});

export default router;