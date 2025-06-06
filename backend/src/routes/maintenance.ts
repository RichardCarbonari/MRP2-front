import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware de validação para solicitações de manutenção
const validateMaintenanceRequest = (req: Request, res: Response, next: NextFunction) => {
  const { equipment, description, priority, department } = req.body;

  if (!equipment || !description || !priority || !department) {
    return res.status(400).json({
      message: 'Todos os campos são obrigatórios: equipment, description, priority, department'
    });
  }

  const validPriorities = ['Alta', 'Média', 'Baixa'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      message: 'Prioridade inválida. Use: Alta, Média ou Baixa'
    });
  }

  const validDepartments = ['Produção', 'Usinagem', 'Estamparia', 'Montagem'];
  if (!validDepartments.includes(department)) {
    return res.status(400).json({
      message: 'Departamento inválido. Use: Produção, Usinagem, Estamparia ou Montagem'
    });
  }

  next();
};

// Middleware de validação para status
const validateStatus = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  const validStatus = ['Pendente', 'Em Andamento', 'Agendada', 'Concluída'];

  if (!status || !validStatus.includes(status)) {
    return res.status(400).json({
      message: 'Status inválido. Use: Pendente, Em Andamento, Agendada ou Concluída'
    });
  }

  next();
};

// 📋 ROTAS PARA FUNCIONÁRIOS (CRIAR SOLICITAÇÕES)

// Criar uma nova solicitação de manutenção
router.post('/requests', validateMaintenanceRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { equipment, description, priority, department } = req.body;
    
    const maintenanceRequest = await prisma.maintenanceRequest.create({
      data: {
        equipment,
        description,
        priority,
        department,
        status: 'Pendente',
        requestedBy: req.body.userId || 'temp-user', // Usuário autenticado
        requestedAt: new Date()
      }
    });

    res.status(201).json(maintenanceRequest);
  } catch (error) {
    next(error);
  }
});

// Listar solicitações do usuário logado
router.get('/requests', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: {
        requestedBy: req.body.userId || 'temp-user' // Usuário autenticado
      },
      orderBy: {
        requestedAt: 'desc'
      }
    });

    res.json(maintenanceRequests);
  } catch (error) {
    next(error);
  }
});

// 🔧 ROTAS PARA EQUIPE DE MANUTENÇÃO (GERENCIAR TODOS OS PEDIDOS)

// Listar TODOS os pedidos de manutenção (para equipe de manutenção)
router.get('/all-requests', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, priority } = req.query;
    
    const filters: any = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const allRequests = await prisma.maintenanceRequest.findMany({
      where: filters,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // Pendentes primeiro
        { priority: 'desc' }, // Alta prioridade primeiro
        { requestedAt: 'desc' }
      ]
    });

    // Mapear para incluir nome do solicitante
    const requestsWithUserInfo = allRequests.map(request => ({
      ...request,
      requestedByName: request.user.name,
      requestedByEmail: request.user.email
    }));

    res.json(requestsWithUserInfo);
  } catch (error) {
    next(error);
  }
});

// Atribuir um pedido para a equipe de manutenção
router.put('/requests/:id/assign', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { assignedTo, notes } = req.body;

    const existingRequest = await prisma.maintenanceRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return res.status(404).json({
        message: 'Solicitação de manutenção não encontrada'
      });
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: { 
        status: 'Em Andamento',
        // assignedTo, // Será adicionado quando expandir o schema
        // notes // Será adicionado quando expandir o schema
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    next(error);
  }
});

// Atualizar status e adicionar observações
router.put('/requests/:id/update', validateStatus, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, solution, notes } = req.body;

    const existingRequest = await prisma.maintenanceRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return res.status(404).json({
        message: 'Solicitação de manutenção não encontrada'
      });
    }

    // Se está sendo marcado como concluído, incluir data de conclusão
    const updateData: any = { status };
    
    if (status === 'Concluída') {
      // Adicionar solução na descrição por enquanto (até expandir schema)
      updateData.description = existingRequest.description + 
        (solution ? `\n\n✅ SOLUÇÃO: ${solution}` : '') +
        (notes ? `\n📝 OBSERVAÇÕES: ${notes}` : '');
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: updateData
    });

    res.json(updatedRequest);
  } catch (error) {
    next(error);
  }
});

// Obter estatísticas para dashboard de manutenção
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedToday,
      highPriorityPending
    ] = await Promise.all([
      prisma.maintenanceRequest.count(),
      prisma.maintenanceRequest.count({ where: { status: 'Pendente' } }),
      prisma.maintenanceRequest.count({ where: { status: 'Em Andamento' } }),
      prisma.maintenanceRequest.count({
        where: {
          status: 'Concluída',
          updatedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.maintenanceRequest.count({
        where: {
          status: 'Pendente',
          priority: 'Alta'
        }
      })
    ]);

    res.json({
      total: totalRequests,
      pending: pendingRequests,
      inProgress: inProgressRequests,
      completedToday,
      highPriorityPending
    });
  } catch (error) {
    next(error);
  }
});

// Atualizar o status de uma solicitação (rota original mantida para compatibilidade)
router.put('/requests/:id', validateStatus, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingRequest = await prisma.maintenanceRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return res.status(404).json({
        message: 'Solicitação de manutenção não encontrada'
      });
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: { status }
    });

    res.json(updatedRequest);
  } catch (error) {
    next(error);
  }
});

// Middleware de erro específico para erros do Prisma
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.code === 'P2002') {
    return res.status(400).json({
      message: 'Erro de restrição única no banco de dados'
    });
  }
  if (error.code === 'P2025') {
    return res.status(404).json({
      message: 'Registro não encontrado'
    });
  }
  next(error);
});

export default router; 