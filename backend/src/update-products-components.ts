import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Componentes utilizados para montar cada CPU
const componentMapping: { [key: string]: string[] } = {
  'Intel Core i9-13900K': [
    'Dissipador Térmico Cooler Master Hyper 212',
    'Pasta Térmica Arctic Silver 5',
    'Coolers auxiliares 120mm',
    'Cabo de alimentação 8-pin'
  ],
  'AMD Ryzen 9 7950X': [
    'Cooler Wraith Prism RGB',
    'Pasta Térmica Noctua NT-H1',
    'Coolers de exaustão 140mm',
    'Cabo de alimentação 8-pin + 4-pin'
  ],
  'Intel Core i7-13700K': [
    'Dissipador Térmico Noctua NH-U12S',
    'Pasta Térmica Thermal Grizzly Kryonaut',
    'Coolers frontais 120mm',
    'Cabo de alimentação 8-pin'
  ],
  'AMD Ryzen 7 7800X3D': [
    'Cooler AMD Wraith Spire',
    'Pasta Térmica Arctic MX-4',
    'Sistema de refrigeração líquida AIO 240mm',
    'Cabo de alimentação 8-pin'
  ],
  'Intel Core i5-13600K': [
    'Dissipador Stock Intel',
    'Pasta Térmica incluída',
    'Coolers básicos 92mm',
    'Cabo de alimentação 8-pin'
  ],
  'Intel Xeon Platinum 8480+': [
    'Sistema de refrigeração líquida personalizada',
    'Pasta Térmica Industrial Shin-Etsu X23-7783D',
    'Coolers redundantes 80mm',
    'Cabo de alimentação duplo 8-pin',
    'Sistema de monitoramento térmico',
    'Dissipadores de backup'
  ],
  'AMD EPYC 9654': [
    'Sistema de refrigeração líquida enterprise',
    'Pasta Térmica Industrial Arctic Silver Ceramique',
    'Coolers hot-swap 60mm',
    'Cabo de alimentação triplo 8-pin',
    'Sensores de temperatura redundantes',
    'Sistema de alertas térmicos'
  ],
  'Intel Xeon Gold 6448Y': [
    'Dissipador enterprise Noctua NH-U9 DX-4677',
    'Pasta Térmica Thermal Grizzly Conductonaut',
    'Coolers de rack 80mm',
    'Cabo de alimentação duplo 8-pin',
    'Sistema de monitoramento térmico'
  ],
  'AMD EPYC 9454': [
    'Sistema de refrigeração líquida Corsair H150i PRO',
    'Pasta Térmica Industrial MX-4',
    'Coolers redundantes 92mm',
    'Cabo de alimentação duplo 8-pin + 4-pin',
    'Sensores de temperatura'
  ],
  'Intel Xeon Silver 4410Y': [
    'Dissipador Stock Intel Xeon',
    'Pasta Térmica incluída',
    'Coolers básicos enterprise 80mm',
    'Cabo de alimentação 8-pin',
    'Sistema básico de monitoramento'
  ]
};

async function updateProductsWithComponents() {
  console.log('🔧 Atualizando produtos com componentes utilizados...');
  
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          in: ['CPU', 'CPU_Servidor']
        }
      }
    });

    for (const product of products) {
      const components = componentMapping[product.name];
      
      if (components) {
        const componentsText = components.join(', ');
        const newDescription = `${product.description}\n\n🔧 Componentes utilizados na montagem: ${componentsText}`;
        
        // Atualizar especificações para incluir componentes
        const updatedSpecs = {
          ...product.specifications as any,
          components_utilizados: components,
          montagem_incluida: true,
          garantia_montagem: '12 meses',
          suporte_tecnico: 'Incluso'
        };

        await prisma.product.update({
          where: { id: product.id },
          data: {
            description: newDescription,
            specifications: updatedSpecs
          }
        });

        console.log(`✅ ${product.name} - Componentes adicionados:`);
        components.forEach(comp => console.log(`   • ${comp}`));
        console.log('');
      }
    }

    console.log('🎉 Todos os produtos foram atualizados com seus componentes!');
    
    // Mostrar resumo
    const updatedProducts = await prisma.product.findMany({
      where: {
        category: {
          in: ['CPU', 'CPU_Servidor']
        }
      },
      select: {
        name: true,
        category: true,
        description: true
      }
    });

    console.log('\n📋 Produtos atualizados:');
    updatedProducts.forEach(product => {
      console.log(`  ${product.category}: ${product.name}`);
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar produtos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updateProductsWithComponents();
}

export default updateProductsWithComponents; 