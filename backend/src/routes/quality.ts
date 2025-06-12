import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Mock data para relatórios de qualidade
const qualityReports = [
    {
        id: 'QR001',
        title: 'Relatório de Qualidade - Dezembro 2024',
        type: 'monthly',
        status: 'completed',
        createdAt: '2024-12-15T10:00:00Z',
        updatedAt: '2024-12-15T10:00:00Z',
        summary: {
            totalTests: 156,
            passedTests: 148,
            failedTests: 8,
            passRate: 94.87,
            categories: {
                hardware: { total: 78, passed: 75, failed: 3 },
                software: { total: 45, passed: 43, failed: 2 },
                integration: { total: 33, passed: 30, failed: 3 }
            }
        }
    },
    {
        id: 'QR002', 
        title: 'Relatório Semanal - Semana 50',
        type: 'weekly',
        status: 'in_progress',
        createdAt: '2024-12-12T09:00:00Z',
        updatedAt: '2024-12-16T14:30:00Z',
        summary: {
            totalTests: 45,
            passedTests: 42,
            failedTests: 3,
            passRate: 93.33,
            categories: {
                hardware: { total: 20, passed: 19, failed: 1 },
                software: { total: 15, passed: 14, failed: 1 },
                integration: { total: 10, passed: 9, failed: 1 }
            }
        }
    }
];

// Mock data para métricas de qualidade
const qualityMetrics = {
    overview: {
        totalProducts: 342,
        qualityScore: 94.2,
        defectRate: 5.8,
        customerSatisfaction: 4.6
    },
    trends: {
        lastMonth: {
            qualityScore: 93.1,
            defectRate: 6.9,
            improvement: "+1.1%"
        },
        lastWeek: {
            qualityScore: 95.2,
            defectRate: 4.8,
            improvement: "+2.1%"
        }
    },
    categories: [
        {
            name: 'Hardware Quality',
            score: 96.5,
            trend: 'up',
            issues: 12,
            resolved: 10
        },
        {
            name: 'Software Quality', 
            score: 92.8,
            trend: 'stable',
            issues: 8,
            resolved: 7
        },
        {
            name: 'Integration Tests',
            score: 89.4,
            trend: 'down',
            issues: 15,
            resolved: 11
        }
    ],
    recentIssues: [
        {
            id: 'QI001',
            title: 'GPU não detectada em teste de hardware',
            severity: 'high',
            status: 'resolved',
            reportedAt: '2024-12-15T08:30:00Z',
            resolvedAt: '2024-12-15T14:20:00Z'
        },
        {
            id: 'QI002',
            title: 'Falha em teste de stress de CPU',
            severity: 'medium',
            status: 'in_progress',
            reportedAt: '2024-12-16T10:15:00Z'
        }
    ]
};

// Middleware de validação para relatórios de qualidade
const validateQualityReport = (req: Request, res: Response, next: NextFunction) => {
  const { title, type, description, category } = req.body;

  if (!title || !type || !description || !category) {
    return res.status(400).json({
      message: 'Todos os campos são obrigatórios: title, type, description, category'
    });
  }

  const validTypes = ['hardware', 'software', 'integration'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      message: 'Tipo inválido. Use: hardware, software ou integration'
    });
  }

  next();
};

// GET /api/quality/reports - Buscar relatórios de qualidade
router.get('/reports', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    // Se for admin, retorna todos os relatórios
    if (user.role === 'admin') {
      const reports = await prisma.qualityReport.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Mapear para incluir informações do usuário
      const reportsWithUserInfo = reports.map(report => ({
        ...report,
        reportedByName: report.user.name,
        reportedByEmail: report.user.email
      }));

      return res.json(reportsWithUserInfo);
    }

    // Se for funcionário, retorna apenas seus relatórios
    const reports = await prisma.qualityReport.findMany({
      where: {
        reportedBy: user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// GET /api/quality/metrics - Buscar métricas de qualidade
router.get('/metrics', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    // Apenas admin pode ver métricas
    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Acesso negado. Apenas administradores podem ver métricas'
      });
    }

    const totalReports = await prisma.qualityReport.count();
    const pendingReports = await prisma.qualityReport.count({
      where: { status: 'pending' }
    });
    const resolvedReports = await prisma.qualityReport.count({
      where: { status: 'resolved' }
    });

    const metrics = {
      overview: {
        totalReports,
        pendingReports,
        resolvedReports,
        resolutionRate: totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0
      },
      byCategory: await prisma.qualityReport.groupBy({
        by: ['category'],
        _count: true
      }),
      byType: await prisma.qualityReport.groupBy({
        by: ['type'],
        _count: true
      })
    };

    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

// GET /api/quality/reports/:id - Buscar relatório específico
router.get('/reports/:id', (req, res) => {
    try {
        const { id } = req.params;
        console.log(`✅ GET /api/quality/reports/${id} - Buscando relatório específico`);
        
        const report = qualityReports.find(r => r.id === id);
        
        if (!report) {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }
        
        res.json(report);
    } catch (error) {
        console.error('❌ Erro ao buscar relatório:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/quality/reports - Criar novo relatório
router.post('/reports', authMiddleware, validateQualityReport, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, type, description, category } = req.body;
    const userId = (req as any).user.userId;

    const report = await prisma.qualityReport.create({
      data: {
        title,
        type,
        description,
        category,
        status: 'pending',
        reportedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
});

// PUT /api/quality/reports/:id - Atualizar relatório
router.put('/reports/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes, resolution } = req.body;
    const user = (req as any).user;

    const report = await prisma.qualityReport.findUnique({
      where: { id }
    });

    if (!report) {
      return res.status(404).json({
        message: 'Relatório não encontrado'
      });
    }

    // Apenas admin pode atualizar status e resolução
    if (user.role !== 'admin' && (status || resolution)) {
      return res.status(403).json({
        message: 'Apenas administradores podem atualizar o status e resolução'
      });
    }

    const updatedReport = await prisma.qualityReport.update({
      where: { id },
      data: {
        status: status || report.status,
        notes: notes || report.notes,
        resolution: resolution || report.resolution,
        updatedAt: new Date()
      }
    });

    res.json(updatedReport);
  } catch (error) {
    next(error);
  }
});

export default router; 