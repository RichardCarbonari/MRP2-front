import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

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

  const validDepartments = ['Montagem Substrato', 'Bonding', 'Encapsulamento', 'Testes', 'Embalagem', 'Produção', 'Usinagem', 'Estamparia', 'Montagem'];
  if (!validDepartments.includes(department)) {
    return res.status(400).json({
      message: 'Departamento inválido. Use: Montagem Substrato, Bonding, Encapsulamento, Testes, Embalagem, Produção, Usinagem, Estamparia ou Montagem'
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
router.post('/requests', authMiddleware, validateMaintenanceRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { equipment, description, priority, department } = req.body;
    const userId = (req as any).user.userId;
    
    const maintenanceRequest = await prisma.maintenanceRequest.create({
      data: {
        equipment,
        description,
        priority,
        department,
        status: 'Pendente',
        requestedBy: userId,
        requestedAt: new Date()
      }
    });

    res.status(201).json(maintenanceRequest);
  } catch (error) {
    next(error);
  }
});

// ===============================================
// MOCK DATA ENDPOINTS (TEMPORARY - FOR DEVELOPMENT)
// ===============================================

// GET /api/maintenance/mock-requests - Dados mockados realistas
router.get('/mock-requests', (req: Request, res: Response) => {
    try {
        console.log('✅ GET /api/maintenance/mock-requests - Buscando dados mockados');
        
        const mockRequests = [
            {
                id: 'MNT001',
                equipment: 'Torno CNC Mazak QT-15',
                description: 'Ruído anormal no eixo principal durante operação. Necessita verificação dos rolamentos e lubrificação.',
                priority: 'Alta',
                department: 'Usinagem',
                status: 'Em Andamento',
                requestedBy: 'Carlos Operador',
                requestedByEmail: 'carlos.operador@mrp2cpu.com.br',
                requestedAt: '2024-12-16T08:30:00Z',
                assignedTo: 'João Técnico',
                estimatedTime: '4 horas'
            },
            {
                id: 'MNT002',
                equipment: 'Prensa Hidráulica Schuler 250T',
                description: 'Vazamento de óleo no sistema hidráulico. Pressão instável durante estampagem.',
                priority: 'Alta',
                department: 'Estamparia',
                status: 'Pendente',
                requestedBy: 'Maria Supervisora',
                requestedByEmail: 'maria.supervisora@mrp2cpu.com.br',
                requestedAt: '2024-12-16T09:15:00Z',
                estimatedTime: '6 horas'
            },
            {
                id: 'MNT003',
                equipment: 'Esteira Transportadora Linha 3',
                description: 'Motor da esteira apresenta sobrecarga. Verificar tensão da correia e alinhamento.',
                priority: 'Média',
                department: 'Montagem',
                status: 'Agendada',
                requestedBy: 'Pedro Montador',
                requestedByEmail: 'pedro.montador@mrp2cpu.com.br',
                requestedAt: '2024-12-15T14:20:00Z',
                scheduledFor: '2024-12-17T07:00:00Z',
                assignedTo: 'Ricardo Elétrica',
                estimatedTime: '3 horas'
            },
            {
                id: 'MNT004',
                equipment: 'Compressor Atlas Copco GA22',
                description: 'Temperatura elevada e consumo excessivo de energia. Limpeza dos filtros necessária.',
                priority: 'Média',
                department: 'Produção',
                status: 'Concluída',
                requestedBy: 'Ana Técnica',
                requestedByEmail: 'ana.tecnica@mrp2cpu.com.br',
                requestedAt: '2024-12-14T10:45:00Z',
                completedAt: '2024-12-15T16:30:00Z',
                assignedTo: 'Bruno Mecânico',
                solution: 'Filtros de ar substituídos e limpeza geral do sistema. Temperatura normalizada.',
                timeSpent: '2.5 horas'
            },
            {
                id: 'MNT005',
                equipment: 'Soldadora Robótica KUKA KR6',
                description: 'Falha no programa de soldagem. Robô para na posição 3 da sequência.',
                priority: 'Alta',
                department: 'Montagem',
                status: 'Em Andamento',
                requestedBy: 'Lucas Programador',
                requestedByEmail: 'lucas.programador@mrp2cpu.com.br',
                requestedAt: '2024-12-16T11:00:00Z',
                assignedTo: 'Marcos Automação',
                estimatedTime: '5 horas'
            },
            {
                id: 'MNT006',
                equipment: 'Fresadora CNC Haas VF-2',
                description: 'Alarme de temperatura no spindle. Sistema de refrigeração com vazão reduzida.',
                priority: 'Baixa',
                department: 'Usinagem',
                status: 'Agendada',
                requestedBy: 'Roberto Operador',
                requestedByEmail: 'roberto.operador@mrp2cpu.com.br',
                requestedAt: '2024-12-15T16:45:00Z',
                scheduledFor: '2024-12-18T06:00:00Z',
                assignedTo: 'João Técnico',
                estimatedTime: '4 horas'
            }
        ];
        
        res.json(mockRequests);
    } catch (error) {
        console.error('❌ Erro ao buscar dados mockados:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Listar solicitações do usuário logado
router.get('/requests', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    
    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: {
        requestedBy: userId
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
router.get('/all-requests', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
router.put('/requests/:id/assign', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
router.put('/requests/:id/update', authMiddleware, validateStatus, async (req: Request, res: Response, next: NextFunction) => {
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
router.get('/stats', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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

// 🏭 ROTAS PARA GESTÃO DE EQUIPAMENTOS (ADMIN)

// Listar equipamentos
router.get('/equipment', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Dados mockados de equipamentos da fábrica de CPUs
    const equipment = [
      {
        id: 1,
        name: 'Pick & Place Machine ASMPT SIPLACE',
        type: 'Montagem SMT',
        status: 'operational',
        lastMaintenance: '2024-12-15T08:00:00.000Z',
        nextMaintenance: '2025-01-15T08:00:00.000Z',
        location: 'Linha de Montagem Substrato',
        serialNumber: 'SIPLACE-001',
        manufacturer: 'ASMPT',
        model: 'SIPLACE SX4'
      },
      {
        id: 2,
        name: 'Máquina de Wire Bonding ASM AB339',
        type: 'Wire Bonding',
        status: 'maintenance',
        lastMaintenance: '2024-12-20T10:00:00.000Z',
        nextMaintenance: '2025-01-20T10:00:00.000Z',
        location: 'Setor de Bonding',
        serialNumber: 'AB339-002',
        manufacturer: 'ASM',
        model: 'AB339'
      },
      {
        id: 3,
        name: 'Molding Press APIC Yamada YAP-300',
        type: 'Encapsulamento',
        status: 'operational',
        lastMaintenance: '2024-12-18T14:00:00.000Z',
        nextMaintenance: '2025-01-18T14:00:00.000Z',
        location: 'Setor de Encapsulamento',
        serialNumber: 'YAP300-003',
        manufacturer: 'APIC Yamada',
        model: 'YAP-300'
      },
      {
        id: 4,
        name: 'Sistema de Teste ATE Advantest T2000',
        type: 'Teste de CPUs',
        status: 'operational',
        lastMaintenance: '2024-12-19T16:00:00.000Z',
        nextMaintenance: '2025-01-19T16:00:00.000Z',
        location: 'Setor de Testes',
        serialNumber: 'T2000-004',
        manufacturer: 'Advantest',
        model: 'T2000'
      },
      {
        id: 5,
        name: 'Sistema de Visão COGNEX In-Sight 9000',
        type: 'Inspeção Visual',
        status: 'broken',
        lastMaintenance: '2024-12-17T12:00:00.000Z',
        nextMaintenance: '2024-12-22T12:00:00.000Z',
        location: 'Setor de Testes',
        serialNumber: 'IS9000-005',
        manufacturer: 'COGNEX',
        model: 'In-Sight 9000'
      }
    ];

    res.json({
      success: true,
      data: equipment
    });
  } catch (error) {
    next(error);
  }
});

// Listar registros de manutenção
router.get('/records', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Dados mockados de registros de manutenção
    const records = [
      {
        id: 1,
        equipmentId: 1,
        equipmentName: 'Pick & Place Machine ASMPT SIPLACE',
        type: 'preventive',
        description: 'Manutenção preventiva mensal - limpeza e calibração',
        date: '2024-12-15T08:00:00.000Z',
        technician: 'João Paulo Santos',
        cost: 850.00,
        status: 'completed',
        priority: 'medium',
        estimatedDuration: 4,
        completedAt: '2024-12-15T12:00:00.000Z'
      },
      {
        id: 2,
        equipmentId: 2,
        equipmentName: 'Máquina de Wire Bonding ASM AB339',
        type: 'corrective',
        description: 'Correção de precisão do fio de ouro - calibração urgente',
        date: '2024-12-20T10:00:00.000Z',
        technician: 'João Paulo Santos',
        cost: 1200.00,
        status: 'in_progress',
        priority: 'high',
        estimatedDuration: 6
      },
      {
        id: 3,
        equipmentId: 3,
        equipmentName: 'Molding Press APIC Yamada YAP-300',
        type: 'preventive',
        description: 'Verificação do sistema de aquecimento e pressão',
        date: '2024-12-18T14:00:00.000Z',
        technician: 'João Paulo Santos',
        cost: 650.00,
        status: 'completed',
        priority: 'medium',
        estimatedDuration: 3,
        completedAt: '2024-12-18T17:00:00.000Z'
      },
      {
        id: 4,
        equipmentId: 4,
        equipmentName: 'Sistema de Teste ATE Advantest T2000',
        type: 'corrective',
        description: 'Falhas intermitentes no canal 3 - manutenção preventiva',
        date: '2024-12-19T16:00:00.000Z',
        technician: 'João Paulo Santos',
        cost: 2100.00,
        status: 'scheduled',
        priority: 'high',
        estimatedDuration: 8
      },
      {
        id: 5,
        equipmentId: 5,
        equipmentName: 'Sistema de Visão COGNEX In-Sight 9000',
        type: 'corrective',
        description: 'Câmeras desalinhadas - recalibração necessária',
        date: '2024-12-17T12:00:00.000Z',
        technician: 'João Paulo Santos',
        cost: 950.00,
        status: 'scheduled',
        priority: 'high',
        estimatedDuration: 5
      }
    ];

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    next(error);
  }
});

// Obter métricas de equipamentos
router.get('/metrics', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Calcular métricas baseadas nos dados mockados
    const metrics = {
      totalEquipment: 5,
      operationalEquipment: 3,
      maintenanceEquipment: 1,
      brokenEquipment: 1,
      totalMaintenanceRecords: 5,
      scheduledMaintenance: 2,
      inProgressMaintenance: 1,
      completedMaintenance: 2,
      totalMaintenanceCosts: 5750.00,
      averageMaintenanceCost: 1150.00,
      equipmentUptime: 85.5
    };

    res.json({
      success: true,
      data: metrics
    });
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