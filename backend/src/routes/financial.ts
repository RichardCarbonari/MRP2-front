import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 📊 **BUSCAR VENDAS POR PRODUTO ESPECÍFICO (CPUs PRONTAS)**
router.get('/sales-by-product', async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    // Filtros de data
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    // Buscar vendas agrupadas por produto específico
    const salesByProduct = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          status: {
            in: ['delivered', 'ready'] // Apenas pedidos entregues ou prontos
          },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        },
        ...(category && {
          product: {
            category: category as string
          }
        })
      },
      _sum: {
        quantity: true,
        subtotal: true,
        profit: true
      },
      _avg: {
        unitPrice: true
      },
      _count: {
        _all: true
      },
      orderBy: {
        _sum: {
          subtotal: 'desc' // Ordenar por receita (maior para menor)
        }
      }
    });

    // Buscar informações detalhadas de cada produto
    const productSales = await Promise.all(
      salesByProduct.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (product) {
          const unitsSold = item._sum.quantity || 0;
          const revenue = item._sum.subtotal || 0;
          const profit = item._sum.profit || 0;
          const totalCost = unitsSold * product.cost;
          const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

          return {
            productId: product.id,
            productName: product.name,
            category: product.category,
            subcategory: product.subcategory,
            brand: product.brand,
            unitsSold,
            revenue,
            averagePrice: unitsSold > 0 ? revenue / unitsSold : 0,
            profitMargin,
            profit,
            totalCost,
            orderCount: item._count._all || 0,
            specifications: product.specifications,
            description: product.description
          };
        }
        return null;
      })
    );

    // Filtrar produtos nulos e retornar
    const result = productSales.filter(item => item !== null);
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar vendas por produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// 📊 **BUSCAR DADOS FINANCEIROS BASEADOS EM PEDIDOS REAIS**
router.get('/sales-by-category', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Filtros de data
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    // Buscar vendas agrupadas por categoria
    const salesByCategory = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          status: {
            in: ['delivered', 'ready'] // Apenas pedidos entregues ou prontos
          },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        }
      },
      _sum: {
        quantity: true,
        subtotal: true,
        profit: true
      },
      _avg: {
        unitPrice: true
      },
      _count: {
        _all: true
      }
    });

    // Buscar informações dos produtos e agrupar por categoria
    const categoryData: { [key: string]: any } = {};

    for (const item of salesByCategory) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { category: true, name: true, cost: true }
      });

      if (product) {
        const category = product.category;
        
        if (!categoryData[category]) {
          categoryData[category] = {
            category,
            unitsSold: 0,
            revenue: 0,
            totalCost: 0,
            profit: 0,
            orderCount: 0
          };
        }

        categoryData[category].unitsSold += item._sum.quantity || 0;
        categoryData[category].revenue += item._sum.subtotal || 0;
        categoryData[category].profit += item._sum.profit || 0;
        categoryData[category].orderCount += item._count._all || 0;
        categoryData[category].totalCost += (item._sum.quantity || 0) * product.cost;
      }
    }

    // Calcular métricas para cada categoria
    const result = Object.values(categoryData).map((cat: any) => ({
      category: cat.category,
      unitsSold: cat.unitsSold,
      revenue: cat.revenue,
      averagePrice: cat.unitsSold > 0 ? cat.revenue / cat.unitsSold : 0,
      profitMargin: cat.revenue > 0 ? (cat.profit / cat.revenue) * 100 : 0,
      totalCost: cat.totalCost,
      profit: cat.profit,
      orderCount: cat.orderCount
    }));

    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar dados de vendas por categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// 💰 **RESUMO FINANCEIRO GERAL**
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    // Buscar totais de vendas
    const salesSummary = await prisma.order.aggregate({
      where: {
        status: {
          in: ['delivered', 'ready']
        },
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      },
      _sum: {
        totalAmount: true,
        totalCost: true,
        profitAmount: true
      },
      _count: {
        _all: true
      }
    });

    // Custos operacionais fixos (pode ser configurável)
    const operationalCosts = {
      labor: 35000,
      components: 180000,
      logistics: 12000,
      utilities: 8000,
      maintenance: 5000
    };

    const totalOperationalCosts = Object.values(operationalCosts).reduce((a, b) => a + b, 0);
    const totalRevenue = salesSummary._sum.totalAmount || 0;
    const totalProductCosts = salesSummary._sum.totalCost || 0;
    const grossProfit = totalRevenue - totalProductCosts;
    const netProfit = grossProfit - totalOperationalCosts;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    res.json({
      totalRevenue,
      totalCosts: totalProductCosts + totalOperationalCosts,
      grossProfit,
      netProfit,
      profitMargin,
      operationalCosts: {
        ...operationalCosts,
        total: totalOperationalCosts
      },
      ordersCount: salesSummary._count._all || 0,
      avgOrderValue: salesSummary._count._all ? totalRevenue / salesSummary._count._all : 0
    });
  } catch (error) {
    console.error('Erro ao buscar resumo financeiro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// 📈 **VENDAS POR PERÍODO**
router.get('/sales-by-period', async (req, res) => {
  try {
    const { period = 'monthly' } = req.query; // daily, weekly, monthly, yearly
    
    let groupBy: string;
    let formatStr: string;
    
    switch (period) {
      case 'daily':
        groupBy = '%Y-%m-%d';
        formatStr = 'YYYY-MM-DD';
        break;
      case 'weekly':
        groupBy = '%Y-%W';
        formatStr = 'YYYY-WW';
        break;
      case 'yearly':
        groupBy = '%Y';
        formatStr = 'YYYY';
        break;
      default: // monthly
        groupBy = '%Y-%m';
        formatStr = 'YYYY-MM';
    }

    // Para SQLite, usamos uma abordagem diferente
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['delivered', 'ready']
        }
      },
      select: {
        createdAt: true,
        totalAmount: true,
        profitAmount: true
      }
    });

    // Agrupar manualmente por período
    const periodData: { [key: string]: any } = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      let periodKey: string;
      
      switch (period) {
        case 'daily':
          periodKey = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const startOfYear = new Date(date.getFullYear(), 0, 1);
          const weekNumber = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7);
          periodKey = `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
          break;
        case 'yearly':
          periodKey = date.getFullYear().toString();
          break;
        default: // monthly
          periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }

      if (!periodData[periodKey]) {
        periodData[periodKey] = {
          period: periodKey,
          revenue: 0,
          profit: 0,
          ordersCount: 0
        };
      }

      periodData[periodKey].revenue += order.totalAmount;
      periodData[periodKey].profit += order.profitAmount;
      periodData[periodKey].ordersCount += 1;
    });

    const result = Object.values(periodData).sort((a: any, b: any) => 
      a.period.localeCompare(b.period)
    );

    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar vendas por período:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// 💻 **VENDAS DE CPUs ESPECÍFICAS**
router.get('/cpu-sales', authMiddleware, async (req, res) => {
  try {
    // Dados mockados de vendas de CPUs da fábrica
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

    res.json(cpuSalesData);
  } catch (error) {
    console.error('Erro ao buscar vendas de CPUs:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router; 