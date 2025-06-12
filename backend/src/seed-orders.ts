import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedOrders() {
    console.log('🌱 Iniciando seed de pedidos...');
    
    try {
        // Primeiro, vamos buscar os produtos disponíveis e um usuário admin
        const products = await prisma.product.findMany({
            where: {
                category: 'CPU'
            }
        });

        const adminUser = await prisma.user.findFirst({
            where: {
                role: 'admin'
            }
        });

        if (products.length === 0) {
            console.log('❌ Nenhum produto CPU encontrado. Execute o seed de produtos primeiro.');
            return;
        }

        if (!adminUser) {
            console.log('❌ Nenhum usuário admin encontrado. Execute o seed de usuários primeiro.');
            return;
        }

        console.log(`✅ Encontrados ${products.length} produtos CPU`);

        // Dados de exemplo para pedidos
        const sampleOrders = [
            {
                customerName: 'João Silva',
                customerEmail: 'joao.silva@email.com',
                customerPhone: '(11) 99999-1111',
                quantity: 2,
                status: 'pending' as const,
                deliveredAt: null
            },
            {
                customerName: 'Maria Santos',
                customerEmail: 'maria.santos@empresa.com',
                customerPhone: '(11) 88888-2222',
                quantity: 1,
                status: 'processing' as const,
                deliveredAt: null
            },
            {
                customerName: 'Pedro Oliveira',
                customerEmail: 'pedro.oliveira@gmail.com',
                customerPhone: '(11) 77777-3333',
                quantity: 3,
                status: 'delivered' as const,
                deliveredAt: new Date('2024-01-30')
            },
            {
                customerName: 'Ana Costa',
                customerEmail: 'ana.costa@tech.com',
                customerPhone: '(11) 66666-4444',
                quantity: 1,
                status: 'pending' as const,
                deliveredAt: null
            },
            {
                customerName: 'Carlos Ferreira',
                customerEmail: 'carlos.ferreira@startup.com',
                customerPhone: '(11) 55555-5555',
                quantity: 4,
                status: 'processing' as const,
                deliveredAt: null
            },
            {
                customerName: 'Lucia Rodrigues',
                customerEmail: 'lucia.rodrigues@consultoria.com',
                customerPhone: '(11) 44444-6666',
                quantity: 2,
                status: 'delivered' as const,
                deliveredAt: new Date('2024-01-25')
            }
        ];

        // Criar os pedidos
        for (let i = 0; i < sampleOrders.length; i++) {
            const orderData = sampleOrders[i];
            // Selecionar um produto aleatório
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            
            // Calcular valores
            const unitPrice = randomProduct.price;
            const unitCost = randomProduct.cost;
            const subtotal = unitPrice * orderData.quantity;
            const itemCost = unitCost * orderData.quantity;
            const profit = subtotal - itemCost;

            // Gerar número do pedido único
            const orderNumber = `ORD-2024-${String(i + 1).padStart(3, '0')}`;

            const order = await prisma.order.create({
                data: {
                    orderNumber: orderNumber,
                    customerName: orderData.customerName,
                    customerEmail: orderData.customerEmail,
                    customerPhone: orderData.customerPhone,
                    status: orderData.status,
                    totalAmount: subtotal,
                    totalCost: itemCost,
                    profitAmount: profit,
                    createdBy: adminUser.id,
                    deliveredAt: orderData.deliveredAt,
                    items: {
                        create: {
                            productId: randomProduct.id,
                            quantity: orderData.quantity,
                            unitPrice: unitPrice,
                            unitCost: unitCost,
                            subtotal: subtotal,
                            profit: profit
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

            console.log(`✅ Pedido criado: ${order.orderNumber} - ${order.customerName}`);
            console.log(`   📦 ${randomProduct.name} (${orderData.quantity}x) - R$ ${subtotal.toFixed(2)}`);
        }

        console.log('🎉 Seed de pedidos concluído com sucesso!');
        
        // Mostrar estatísticas
        const totalOrders = await prisma.order.count();
        const pendingOrders = await prisma.order.count({ where: { status: 'pending' } });
        const processingOrders = await prisma.order.count({ where: { status: 'processing' } });
        const deliveredOrders = await prisma.order.count({ where: { status: 'delivered' } });

        const totalRevenue = await prisma.order.aggregate({
            _sum: { totalAmount: true }
        });

        console.log('\n📊 Estatísticas dos pedidos:');
        console.log(`Total de pedidos: ${totalOrders}`);
        console.log(`Pendentes: ${pendingOrders}`);
        console.log(`Em processamento: ${processingOrders}`);
        console.log(`Entregues: ${deliveredOrders}`);
        console.log(`Receita total: R$ ${(totalRevenue._sum.totalAmount || 0).toFixed(2)}`);

    } catch (error) {
        console.error('❌ Erro ao fazer seed dos pedidos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    seedOrders();
}

export default seedOrders; 