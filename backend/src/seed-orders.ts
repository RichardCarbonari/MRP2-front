import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedOrders() {
    console.log('🛒 Criando pedidos de exemplo...');
    
    try {
        // Buscar usuários e produtos disponíveis
        const users = await prisma.user.findMany();
        const products = await prisma.product.findMany();

        if (users.length === 0) {
            console.log('❌ Nenhum usuário encontrado. Execute primeiro o seed de usuários.');
            return;
        }

        if (products.length === 0) {
            console.log('❌ Nenhum produto encontrado. Execute primeiro o seed de produtos.');
            return;
        }

        const adminUser = users.find(u => u.role === 'admin') || users[0];

        // Criar pedidos de exemplo
        const sampleOrders = [
            // Pedido 1: Sistema Gaming High-End
            {
                orderNumber: 'ORD-2024-001',
                customerName: 'João Silva - Gaming Setup',
                customerEmail: 'joao.silva@email.com',
                customerPhone: '(11) 99999-0001',
                status: 'delivered',
                items: [
                    { productName: 'Intel Core i9-13900K', quantity: 1 },
                    { productName: 'NVIDIA RTX 4090', quantity: 1 },
                    { productName: 'DDR5-5600 32GB Kit', quantity: 1 }
                ]
            },
            // Pedido 2: Servidor Empresarial
            {
                orderNumber: 'ORD-2024-002',
                customerName: 'Empresa TechCorp - Servidor Principal',
                customerEmail: 'compras@techcorp.com.br',
                customerPhone: '(11) 3333-0001',
                status: 'delivered',
                items: [
                    { productName: 'Intel Xeon Platinum 8480+', quantity: 2 },
                    { productName: 'DDR5-5600 32GB Kit', quantity: 8 }
                ]
            },
            // Pedido 3: Workstation AMD
            {
                orderNumber: 'ORD-2024-003',
                customerName: 'Maria Santos - Workstation',
                customerEmail: 'maria.santos@design.com',
                customerPhone: '(11) 88888-0003',
                status: 'delivered',
                items: [
                    { productName: 'AMD Ryzen 9 7950X', quantity: 1 },
                    { productName: 'AMD RX 7900 XTX', quantity: 1 },
                    { productName: 'DDR5-5600 32GB Kit', quantity: 2 }
                ]
            },
            // Pedido 4: Gaming Otimizado
            {
                orderNumber: 'ORD-2024-004',
                customerName: 'Pedro Costa - Gamer Pro',
                customerEmail: 'pedro.gamer@email.com',
                customerPhone: '(11) 77777-0004',
                status: 'delivered',
                items: [
                    { productName: 'AMD Ryzen 7 7800X3D', quantity: 1 },
                    { productName: 'NVIDIA RTX 4090', quantity: 1 },
                    { productName: 'DDR5-5600 32GB Kit', quantity: 1 }
                ]
            },
            // Pedido 5: Servidor Médio Porte
            {
                orderNumber: 'ORD-2024-005',
                customerName: 'DataCenter Solutions',
                customerEmail: 'vendas@datacenter.com.br',
                customerPhone: '(11) 4444-0005',
                status: 'ready',
                items: [
                    { productName: 'AMD EPYC 9654', quantity: 1 },
                    { productName: 'DDR5-5600 32GB Kit', quantity: 16 }
                ]
            },
            // Pedido 6: Build Mainstream
            {
                orderNumber: 'ORD-2024-006',
                customerName: 'Carlos Oliveira - Office Build',
                customerEmail: 'carlos.office@empresa.com',
                customerPhone: '(11) 66666-0006',
                status: 'delivered',
                items: [
                    { productName: 'Intel Core i5-13600K', quantity: 2 },
                    { productName: 'DDR5-5600 32GB Kit', quantity: 2 }
                ]
            },
            // Pedido 7: Servidor Enterprise
            {
                orderNumber: 'ORD-2024-007',
                customerName: 'Mega Corp Ltda',
                customerEmail: 'ti@megacorp.com.br',
                customerPhone: '(11) 2222-0007',
                status: 'delivered',
                items: [
                    { productName: 'Intel Xeon Gold 6448Y', quantity: 4 },
                    { productName: 'AMD EPYC 9454', quantity: 2 }
                ]
            },
            // Pedido 8: Gaming Médio
            {
                orderNumber: 'ORD-2024-008',
                customerName: 'Ana Paula - Gaming',
                customerEmail: 'ana.gamer@email.com',
                customerPhone: '(11) 55555-0008',
                status: 'delivered',
                items: [
                    { productName: 'Intel Core i7-13700K', quantity: 1 },
                    { productName: 'AMD RX 7900 XTX', quantity: 1 },
                    { productName: 'DDR5-5600 32GB Kit', quantity: 1 }
                ]
            }
        ];

        for (const orderData of sampleOrders) {
            let totalAmount = 0;
            let totalCost = 0;
            const orderItems = [];

            // Calcular totais e preparar itens
            for (const item of orderData.items) {
                const product = products.find(p => p.name === item.productName);
                if (product) {
                    const subtotal = product.price * item.quantity;
                    const itemCost = product.cost * item.quantity;
                    const profit = subtotal - itemCost;

                    totalAmount += subtotal;
                    totalCost += itemCost;

                    orderItems.push({
                        productId: product.id,
                        quantity: item.quantity,
                        unitPrice: product.price,
                        unitCost: product.cost,
                        subtotal,
                        profit
                    });
                }
            }

            const profitAmount = totalAmount - totalCost;

            // Criar o pedido
            const order = await prisma.order.create({
                data: {
                    orderNumber: orderData.orderNumber,
                    customerName: orderData.customerName,
                    customerEmail: orderData.customerEmail,
                    customerPhone: orderData.customerPhone,
                    status: orderData.status,
                    totalAmount,
                    totalCost,
                    profitAmount,
                    createdBy: adminUser.id,
                    deliveredAt: orderData.status === 'delivered' ? new Date() : null,
                    items: {
                        create: orderItems
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

            console.log(`✅ Pedido criado: ${order.orderNumber} - ${order.customerName}`);
            console.log(`   💰 Total: R$ ${totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
            console.log(`   📦 ${orderItems.length} itens`);
        }

        console.log('\n🎉 Todos os pedidos foram criados com sucesso!');
        
        // Estatísticas finais
        const orderCount = await prisma.order.count();
        const totalRevenue = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: { in: ['delivered', 'ready'] } }
        });

        console.log(`📊 Total de pedidos: ${orderCount}`);
        console.log(`💰 Receita total: R$ ${(totalRevenue._sum.totalAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);

        // Vendas por categoria
        const salesByCategory = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
                subtotal: true
            },
            where: {
                order: {
                    status: { in: ['delivered', 'ready'] }
                }
            }
        });

        console.log('\n📋 Resumo de vendas por categoria:');
        const categoryTotals: { [key: string]: { quantity: number; revenue: number } } = {};
        
        for (const sale of salesByCategory) {
            const product = products.find(p => p.id === sale.productId);
            if (product) {
                if (!categoryTotals[product.category]) {
                    categoryTotals[product.category] = { quantity: 0, revenue: 0 };
                }
                categoryTotals[product.category].quantity += sale._sum.quantity || 0;
                categoryTotals[product.category].revenue += sale._sum.subtotal || 0;
            }
        }

        Object.entries(categoryTotals).forEach(([category, data]) => {
            console.log(`  ${category}: ${data.quantity} unidades - R$ ${data.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
        });

    } catch (error) {
        console.error('❌ Erro ao criar pedidos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    seedOrders();
}

export default seedOrders; 