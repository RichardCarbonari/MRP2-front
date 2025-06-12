/**
 * 🌱 SCRIPT DE SEED - PRODUTOS
 * 
 * Este script popula o banco de dados com um catálogo completo de produtos
 * para o sistema MRP2. Inclui CPUs, GPUs, RAM e outros componentes com
 * especificações técnicas detalhadas e preços realistas.
 * 
 * Execução: npx ts-node src/seed-products.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    console.log('🌱 Iniciando seed de produtos...');

    // 🖥️ PROCESSADORES DESKTOP - Linha principal de produtos
    const cpuProducts = [
      {
        name: 'Intel Core i9-13900K',
        category: 'CPU',
        subcategory: 'Gaming High-End',
        brand: 'Intel',
        price: 3000.00,      // Preço de venda
        cost: 2000.00,       // Custo de aquisição
        description: 'Processador Intel de 13ª geração com 24 cores e 32 threads. Ideal para gaming extremo e workstations profissionais.',
        specifications: {
          // Especificações técnicas detalhadas
          cores: 24,
          threads: 32,
          baseClock: '3.0 GHz',
          boostClock: '5.8 GHz',
          socket: 'LGA1700',
          tdp: '125W',
          cache: '36 MB',
          architecture: 'Raptor Lake',
          memorySupport: 'DDR4-3200, DDR5-5600',
          integratedGraphics: 'Intel UHD Graphics 770',
          // Especificações para compatibilidade com sistema antigo
          processor: 'Intel Core i9-13900K 24-Core',
          motherboard: 'Compatível com LGA1700',
          ram: 'DDR5-5600 suportada',
          storage: 'NVMe PCIe 5.0',
          gpu: 'UHD Graphics 770 integrada',
          powerSupply: '750W recomendado',
          case: 'ATX Mid Tower'
        },
        stock: 15
      },
      {
        name: 'AMD Ryzen 9 7950X',
        category: 'CPU',
        subcategory: 'Workstation',
        brand: 'AMD',
        price: 2800.00,
        cost: 1900.00,
        description: 'Processador AMD Ryzen série 7000 com arquitetura Zen 4. Excelente para criação de conteúdo e aplicações profissionais.',
        specifications: {
          cores: 16,
          threads: 32,
          baseClock: '4.5 GHz',
          boostClock: '5.7 GHz',
          socket: 'AM5',
          tdp: '170W',
          cache: '64 MB',
          architecture: 'Zen 4',
          memorySupport: 'DDR5-5200',
          integratedGraphics: 'AMD Radeon Graphics',
          processor: 'AMD Ryzen 9 7950X 16-Core',
          motherboard: 'Compatível com AM5',
          ram: 'DDR5-5200 suportada',
          storage: 'NVMe PCIe 5.0',
          gpu: 'Radeon Graphics integrada',
          powerSupply: '850W recomendado',
          case: 'ATX Mid Tower'
        },
        stock: 12
      },
      {
        name: 'Intel Core i7-13700K',
        category: 'CPU',
        subcategory: 'Gaming Mainstream',
        brand: 'Intel',
        price: 2200.00,
        cost: 1500.00,
        description: 'Processador Intel i7 de 13ª geração. Equilíbrio perfeito entre performance e custo para gamers entusiastas.',
        specifications: {
          cores: 16,
          threads: 24,
          baseClock: '3.4 GHz',
          boostClock: '5.4 GHz',
          socket: 'LGA1700',
          tdp: '125W',
          cache: '30 MB',
          architecture: 'Raptor Lake',
          memorySupport: 'DDR4-3200, DDR5-5600',
          integratedGraphics: 'Intel UHD Graphics 770',
          processor: 'Intel Core i7-13700K 16-Core',
          motherboard: 'Compatível com LGA1700',
          ram: 'DDR5-5600 suportada',
          storage: 'NVMe PCIe 4.0',
          gpu: 'UHD Graphics 770 integrada',
          powerSupply: '650W recomendado',
          case: 'ATX Mid Tower'
        },
        stock: 20
      },
      {
        name: 'AMD Ryzen 7 7800X3D',
        category: 'CPU',
        subcategory: 'Gaming Specialist',
        brand: 'AMD',
        price: 2600.00,
        cost: 1800.00,
        description: 'Processador AMD com tecnologia 3D V-Cache. Líder absoluto em performance para jogos.',
        specifications: {
          cores: 8,
          threads: 16,
          baseClock: '4.2 GHz',
          boostClock: '5.0 GHz',
          socket: 'AM5',
          tdp: '120W',
          cache: '96 MB', // 3D V-Cache
          architecture: 'Zen 4',
          memorySupport: 'DDR5-5200',
          integratedGraphics: 'AMD Radeon Graphics',
          processor: 'AMD Ryzen 7 7800X3D 8-Core',
          motherboard: 'Compatível com AM5',
          ram: 'DDR5-5200 suportada',
          storage: 'NVMe PCIe 5.0',
          gpu: 'Radeon Graphics integrada',
          powerSupply: '650W recomendado',
          case: 'ATX Mid Tower'
        },
        stock: 8
      },
      {
        name: 'Intel Core i5-13600K',
        category: 'CPU',
        subcategory: 'Gaming Budget',
        brand: 'Intel',
        price: 1800.00,
        cost: 1200.00,
        description: 'Processador Intel i5 de 13ª geração. Excelente custo-benefício para gaming e uso geral.',
        specifications: {
          cores: 14,
          threads: 20,
          baseClock: '3.5 GHz',
          boostClock: '5.1 GHz',
          socket: 'LGA1700',
          tdp: '125W',
          cache: '24 MB',
          architecture: 'Raptor Lake',
          memorySupport: 'DDR4-3200, DDR5-5600',
          integratedGraphics: 'Intel UHD Graphics 770',
          processor: 'Intel Core i5-13600K 14-Core',
          motherboard: 'Compatível com LGA1700',
          ram: 'DDR5-5600 suportada',
          storage: 'NVMe PCIe 4.0',
          gpu: 'UHD Graphics 770 integrada',
          powerSupply: '600W recomendado',
          case: 'ATX Mid Tower'
        },
        stock: 25
      }
    ];

    // 🖥️ PROCESSADORES PARA SERVIDOR - Linha empresarial
    const serverCpuProducts = [
      {
        name: 'Intel Xeon Platinum 8480+',
        category: 'CPU_Servidor',
        subcategory: 'Enterprise',
        brand: 'Intel',
        price: 15000.00,
        cost: 10000.00,
        description: 'Processador Intel Xeon de 4ª geração para servidores críticos e datacenters.',
        specifications: {
          cores: 56,
          threads: 112,
          baseClock: '2.0 GHz',
          boostClock: '3.8 GHz',
          socket: 'LGA4677',
          tdp: '350W',
          cache: '105 MB',
          architecture: 'Sapphire Rapids',
          memorySupport: 'DDR5-4800',
          integratedGraphics: 'Não',
          processor: 'Intel Xeon Platinum 8480+ 56-Core',
          motherboard: 'Servidor LGA4677',
          ram: 'DDR5-4800 ECC',
          storage: 'NVMe Enterprise',
          gpu: 'Dedicada requerida',
          powerSupply: '1200W+ recomendado',
          case: 'Servidor 2U/4U'
        },
        stock: 5
      },
      {
        name: 'AMD EPYC 9654',
        category: 'CPU_Servidor',
        subcategory: 'Datacenter',
        brand: 'AMD',
        price: 12000.00,
        cost: 8000.00,
        description: 'Processador AMD EPYC série 9000 para aplicações de datacenter e virtualização.',
        specifications: {
          cores: 96,
          threads: 192,
          baseClock: '2.4 GHz',
          boostClock: '3.7 GHz',
          socket: 'SP5',
          tdp: '360W',
          cache: '384 MB',
          architecture: 'Zen 4',
          memorySupport: 'DDR5-4800',
          integratedGraphics: 'Não',
          processor: 'AMD EPYC 9654 96-Core',
          motherboard: 'Servidor SP5',
          ram: 'DDR5-4800 ECC',
          storage: 'NVMe Enterprise',
          gpu: 'Dedicada requerida',
          powerSupply: '1500W+ recomendado',
          case: 'Servidor 2U/4U'
        },
        stock: 3
      },
      {
        name: 'Intel Xeon Gold 6448Y',
        category: 'CPU_Servidor',
        subcategory: 'Business',
        brand: 'Intel',
        price: 8000.00,
        cost: 5500.00,
        description: 'Processador Intel Xeon Gold para servidores de médio porte e aplicações empresariais.',
        specifications: {
          cores: 32,
          threads: 64,
          baseClock: '2.1 GHz',
          boostClock: '4.1 GHz',
          socket: 'LGA4677',
          tdp: '225W',
          cache: '60 MB',
          architecture: 'Sapphire Rapids',
          memorySupport: 'DDR5-4800',
          integratedGraphics: 'Não',
          processor: 'Intel Xeon Gold 6448Y 32-Core',
          motherboard: 'Servidor LGA4677',
          ram: 'DDR5-4800 ECC',
          storage: 'NVMe Enterprise',
          gpu: 'Dedicada requerida',
          powerSupply: '800W+ recomendado',
          case: 'Servidor 1U/2U'
        },
        stock: 8
      },
      {
        name: 'AMD EPYC 9454',
        category: 'CPU_Servidor',
        subcategory: 'SMB',
        brand: 'AMD',
        price: 6500.00,
        cost: 4500.00,
        description: 'Processador AMD EPYC para pequenas e médias empresas com excelente eficiência energética.',
        specifications: {
          cores: 48,
          threads: 96,
          baseClock: '2.75 GHz',
          boostClock: '3.8 GHz',
          socket: 'SP5',
          tdp: '290W',
          cache: '256 MB',
          architecture: 'Zen 4',
          memorySupport: 'DDR5-4800',
          integratedGraphics: 'Não',
          processor: 'AMD EPYC 9454 48-Core',
          motherboard: 'Servidor SP5',
          ram: 'DDR5-4800 ECC',
          storage: 'NVMe Enterprise',
          gpu: 'Dedicada requerida',
          powerSupply: '1000W+ recomendado',
          case: 'Servidor 1U/2U'
        },
        stock: 6
      },
      {
        name: 'Intel Xeon Silver 4410Y',
        category: 'CPU_Servidor',
        subcategory: 'Entry',
        brand: 'Intel',
        price: 4000.00,
        cost: 2800.00,
        description: 'Processador Intel Xeon Silver para servidores de entrada e aplicações básicas.',
        specifications: {
          cores: 12,
          threads: 24,
          baseClock: '2.0 GHz',
          boostClock: '3.9 GHz',
          socket: 'LGA4677',
          tdp: '150W',
          cache: '30 MB',
          architecture: 'Sapphire Rapids',
          memorySupport: 'DDR5-4800',
          integratedGraphics: 'Não',
          processor: 'Intel Xeon Silver 4410Y 12-Core',
          motherboard: 'Servidor LGA4677',
          ram: 'DDR5-4800 ECC',
          storage: 'SATA/NVMe',
          gpu: 'Dedicada opcional',
          powerSupply: '600W+ recomendado',
          case: 'Servidor 1U'
        },
        stock: 10
      }
    ];

    // 🎮 PLACAS DE VÍDEO - Componentes gráficos
    const gpuProducts = [
      {
        name: 'NVIDIA RTX 4090',
        category: 'Placa de Vídeo',
        subcategory: 'Enthusiast',
        brand: 'NVIDIA',
        price: 8000.00,
        cost: 5500.00,
        description: 'Placa de vídeo NVIDIA RTX 4090. A mais poderosa para gaming 4K e criação de conteúdo.',
        specifications: {
          gpu: 'AD102',
          memory: '24GB GDDR6X',
          memoryBus: '384-bit',
          baseClock: '2230 MHz',
          boostClock: '2520 MHz',
          cudaCores: 16384,
          rtCores: 128,
          tensorCores: 512,
          powerConsumption: '450W',
          connectors: '3x DisplayPort 1.4a, 1x HDMI 2.1',
          pciSlot: 'PCIe 4.0 x16'
        },
        stock: 5
      },
      {
        name: 'AMD RX 7900 XTX',
        category: 'Placa de Vídeo',
        subcategory: 'High-End',
        brand: 'AMD',
        price: 6000.00,
        cost: 4200.00,
        description: 'Placa de vídeo AMD Radeon RX 7900 XTX com arquitetura RDNA 3 para gaming 4K.',
        specifications: {
          gpu: 'Navi 31',
          memory: '24GB GDDR6',
          memoryBus: '384-bit',
          baseClock: '1855 MHz',
          boostClock: '2500 MHz',
          streamProcessors: 6144,
          rayAccelerators: 96,
          powerConsumption: '355W',
          connectors: '2x DisplayPort 2.1, 2x HDMI 2.1',
          pciSlot: 'PCIe 4.0 x16'
        },
        stock: 8
      }
    ];

    // 💾 MEMÓRIA RAM - Componentes de memória
    const ramProducts = [
      {
        name: 'DDR5-5600 32GB Kit',
        category: 'Memória RAM',
        subcategory: 'High Performance',
        brand: 'Corsair',
        price: 1200.00,
        cost: 800.00,
        description: 'Kit de memória DDR5 32GB (2x16GB) 5600MHz para sistemas de alta performance.',
        specifications: {
          capacity: '32GB (2x16GB)',
          type: 'DDR5',
          speed: '5600 MHz',
          timings: 'CL36-36-36-76',
          voltage: '1.25V',
          heatspreader: 'Alumínio',
          rgb: 'Sim',
          warranty: '5 anos'
        },
        stock: 30
      }
    ];

    // 📊 CONSOLIDAR TODOS OS PRODUTOS
    const allProducts = [
      ...cpuProducts,
      ...serverCpuProducts,
      ...gpuProducts,
      ...ramProducts
    ];

    console.log(`📦 Preparando ${allProducts.length} produtos para inserção...`);

    // 💾 INSERIR PRODUTOS NO BANCO DE DADOS
    for (const productData of allProducts) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          category: productData.category,
          subcategory: productData.subcategory,
          brand: productData.brand,
          price: productData.price,
          cost: productData.cost,
          description: productData.description,
          specifications: productData.specifications,
          stock: productData.stock,
          isActive: true
        }
      });

      // Log detalhado para cada produto criado
      const marginPercent = ((productData.price - productData.cost) / productData.price * 100).toFixed(1);
      console.log(`✅ ${product.name}`);
      console.log(`   💰 Preço: R$ ${productData.price} | Custo: R$ ${productData.cost} | Margem: ${marginPercent}%`);
      console.log(`   📦 Estoque: ${productData.stock} unidades`);
    }

    console.log('\n🎉 Seed de produtos concluído com sucesso!');
    
    // 📊 ESTATÍSTICAS FINAIS
    const totalProducts = await prisma.product.count();
    const productsByCategory = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true },
      _sum: { stock: true },
      _avg: { price: true }
    });

    console.log('\n📊 Estatísticas do catálogo:');
    console.log(`Total de produtos: ${totalProducts}`);
    
    productsByCategory.forEach(category => {
      console.log(`${category.category}: ${category._count.category} produtos, ${category._sum.stock} em estoque, preço médio R$ ${(category._avg.price || 0).toFixed(2)}`);
    });

    // Calcular valor total do inventário
    const inventoryValue = await prisma.product.aggregate({
      _sum: {
        price: true
      },
      where: {
        isActive: true
      }
    });

    console.log(`💎 Valor total do catálogo: R$ ${(inventoryValue._sum.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);

  } catch (error) {
    console.error('❌ Erro ao fazer seed dos produtos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 🚀 EXECUTAR SCRIPT
seedProducts(); 