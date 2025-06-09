import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  // 🖥️ CPUs para Desktop/Gaming
  {
    name: 'Intel Core i9-13900K',
    category: 'CPU',
    subcategory: 'Gaming',
    brand: 'Intel',
    price: 3200.00,
    cost: 2400.00,
    description: 'Processador Intel Core i9 de 13ª geração, 24 cores, 32 threads',
    specifications: {
      cores: 24,
      threads: 32,
      baseClock: '3.0 GHz',
      boostClock: '5.8 GHz',
      socket: 'LGA1700',
      tdp: '125W'
    },
    stock: 15
  },
  {
    name: 'AMD Ryzen 9 7950X',
    category: 'CPU',
    subcategory: 'Gaming',
    brand: 'AMD',
    price: 2900.00,
    cost: 2200.00,
    description: 'Processador AMD Ryzen 9, 16 cores, 32 threads, arquitetura Zen 4',
    specifications: {
      cores: 16,
      threads: 32,
      baseClock: '4.5 GHz',
      boostClock: '5.7 GHz',
      socket: 'AM5',
      tdp: '170W'
    },
    stock: 12
  },
  {
    name: 'Intel Core i7-13700K',
    category: 'CPU',
    subcategory: 'Gaming',
    brand: 'Intel',
    price: 2400.00,
    cost: 1800.00,
    description: 'Processador Intel Core i7 de 13ª geração, 16 cores, 24 threads',
    specifications: {
      cores: 16,
      threads: 24,
      baseClock: '3.4 GHz',
      boostClock: '5.4 GHz',
      socket: 'LGA1700',
      tdp: '125W'
    },
    stock: 20
  },
  {
    name: 'AMD Ryzen 7 7800X3D',
    category: 'CPU',
    subcategory: 'Gaming',
    brand: 'AMD',
    price: 2600.00,
    cost: 1950.00,
    description: 'Processador AMD Ryzen 7 com 3D V-Cache, otimizado para gaming',
    specifications: {
      cores: 8,
      threads: 16,
      baseClock: '4.2 GHz',
      boostClock: '5.0 GHz',
      socket: 'AM5',
      tdp: '120W',
      features: ['3D V-Cache']
    },
    stock: 18
  },
  {
    name: 'Intel Core i5-13600K',
    category: 'CPU',
    subcategory: 'Mainstream',
    brand: 'Intel',
    price: 1800.00,
    cost: 1350.00,
    description: 'Processador Intel Core i5 de 13ª geração, 14 cores, 20 threads',
    specifications: {
      cores: 14,
      threads: 20,
      baseClock: '3.5 GHz',
      boostClock: '5.1 GHz',
      socket: 'LGA1700',
      tdp: '125W'
    },
    stock: 25
  },

  // 🖥️ CPUs para Servidor
  {
    name: 'Intel Xeon Platinum 8480+',
    category: 'CPU_Servidor',
    subcategory: 'Datacenter',
    brand: 'Intel',
    price: 45000.00,
    cost: 35000.00,
    description: 'Processador Intel Xeon Platinum para servidores de alto desempenho',
    specifications: {
      cores: 56,
      threads: 112,
      baseClock: '2.0 GHz',
      boostClock: '3.8 GHz',
      socket: 'LGA4677',
      tdp: '350W',
      features: ['ECC Support', 'Advanced Security', 'Virtualization']
    },
    stock: 5
  },
  {
    name: 'AMD EPYC 9654',
    category: 'CPU_Servidor',
    subcategory: 'Datacenter',
    brand: 'AMD',
    price: 42000.00,
    cost: 32000.00,
    description: 'Processador AMD EPYC de 4ª geração para servidores empresariais',
    specifications: {
      cores: 96,
      threads: 192,
      baseClock: '2.4 GHz',
      boostClock: '3.7 GHz',
      socket: 'SP5',
      tdp: '360W',
      features: ['ECC Support', 'Infinity Guard', 'SME/SEV']
    },
    stock: 3
  },
  {
    name: 'Intel Xeon Gold 6448Y',
    category: 'CPU_Servidor',
    subcategory: 'Enterprise',
    brand: 'Intel',
    price: 28000.00,
    cost: 21000.00,
    description: 'Processador Intel Xeon Gold para servidores de médio porte',
    specifications: {
      cores: 32,
      threads: 64,
      baseClock: '2.1 GHz',
      boostClock: '4.1 GHz',
      socket: 'LGA4677',
      tdp: '225W',
      features: ['ECC Support', 'Intel TXT', 'Virtualization']
    },
    stock: 8
  },
  {
    name: 'AMD EPYC 9454',
    category: 'CPU_Servidor',
    subcategory: 'Enterprise',
    brand: 'AMD',
    price: 25000.00,
    cost: 19000.00,
    description: 'Processador AMD EPYC para aplicações empresariais',
    specifications: {
      cores: 48,
      threads: 96,
      baseClock: '2.75 GHz',
      boostClock: '3.8 GHz',
      socket: 'SP5',
      tdp: '290W',
      features: ['ECC Support', 'AMD Secure Technology', 'TSME']
    },
    stock: 6
  },
  {
    name: 'Intel Xeon Silver 4410Y',
    category: 'CPU_Servidor',
    subcategory: 'Entry-Server',
    brand: 'Intel',
    price: 15000.00,
    cost: 11500.00,
    description: 'Processador Intel Xeon Silver para servidores de entrada',
    specifications: {
      cores: 12,
      threads: 24,
      baseClock: '2.0 GHz',
      boostClock: '3.9 GHz',
      socket: 'LGA4677',
      tdp: '150W',
      features: ['ECC Support', 'Basic Virtualization']
    },
    stock: 12
  },

  // 🎮 Outros Componentes Existentes
  {
    name: 'NVIDIA RTX 4090',
    category: 'Placa de Vídeo',
    subcategory: 'Enthusiast',
    brand: 'NVIDIA',
    price: 8500.00,
    cost: 6500.00,
    description: 'Placa de vídeo NVIDIA GeForce RTX 4090',
    specifications: {
      memory: '24GB GDDR6X',
      coreClock: '2230 MHz',
      boostClock: '2520 MHz',
      memoryBandwidth: '1008 GB/s'
    },
    stock: 10
  },
  {
    name: 'AMD RX 7900 XTX',
    category: 'Placa de Vídeo',
    subcategory: 'High-End',
    brand: 'AMD',
    price: 4500.00,
    cost: 3400.00,
    description: 'Placa de vídeo AMD Radeon RX 7900 XTX',
    specifications: {
      memory: '24GB GDDR6',
      coreClock: '2300 MHz',
      boostClock: '2500 MHz',
      memoryBandwidth: '960 GB/s'
    },
    stock: 8
  },
  {
    name: 'DDR5-5600 32GB Kit',
    category: 'Memória RAM',
    subcategory: 'High-Performance',
    brand: 'Corsair',
    price: 1200.00,
    cost: 900.00,
    description: 'Kit de memória DDR5 32GB (2x16GB) 5600MHz',
    specifications: {
      capacity: '32GB',
      speed: '5600MHz',
      latency: 'CL36',
      voltage: '1.25V'
    },
    stock: 30
  }
];

async function seedProducts() {
  console.log('🌱 Populando banco de dados com produtos...');
  
  try {
    // Limpar produtos existentes (opcional)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    
    console.log('🗑️ Produtos existentes removidos');

    // Inserir novos produtos
    for (const product of products) {
      await prisma.product.create({
        data: product
      });
      console.log(`✅ Produto criado: ${product.name}`);
    }

    console.log('🎉 Todos os produtos foram criados com sucesso!');
    console.log(`📊 Total de produtos: ${products.length}`);
    
    // Mostrar resumo por categoria
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📋 Resumo por categoria:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} produtos`);
    });

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedProducts();
}

export default seedProducts; 