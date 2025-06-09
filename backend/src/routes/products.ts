import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 📋 **BUSCAR TODOS OS PRODUTOS**
router.get('/', async (req, res) => {
  try {
    const { category, isActive } = req.query;
    
    const products = await prisma.product.findMany({
      where: {
        ...(category && { category: category as string }),
        ...(isActive !== undefined && { isActive: isActive === 'true' })
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// 📋 **BUSCAR PRODUTO POR ID**
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            order: {
              select: {
                orderNumber: true,
                createdAt: true,
                status: true
              }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ➕ **CRIAR PRODUTO**
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      subcategory,
      brand,
      price,
      cost,
      description,
      specifications,
      stock
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        category,
        subcategory,
        brand,
        price: parseFloat(price),
        cost: parseFloat(cost),
        description,
        specifications,
        stock: parseInt(stock) || 0
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ✏️ **ATUALIZAR PRODUTO**
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Converter strings para números se necessário
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.cost) updateData.cost = parseFloat(updateData.cost);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });

    res.json(product);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// 🗑️ **DELETAR PRODUTO (Soft Delete)**
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Produto desativado com sucesso', product });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// 📊 **PRODUTOS MAIS VENDIDOS**
router.get('/stats/best-sellers', async (req, res) => {
  try {
    const bestSellers = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        subtotal: true,
        profit: true
      },
      _count: {
        _all: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 10
    });

    // Buscar informações dos produtos
    const productsWithStats = await Promise.all(
      bestSellers.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        
        return {
          product,
          totalQuantity: item._sum.quantity,
          totalRevenue: item._sum.subtotal,
          totalProfit: item._sum.profit,
          orderCount: item._count._all
        };
      })
    );

    res.json(productsWithStats);
  } catch (error) {
    console.error('Erro ao buscar produtos mais vendidos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// 🏷️ **BUSCAR CATEGORIAS DISPONÍVEIS**
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        _all: true
      },
      orderBy: {
        category: 'asc'
      }
    });

    res.json(categories.map(cat => ({
      category: cat.category,
      count: cat._count._all
    })));
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router; 