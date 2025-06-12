import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Buscar perfil do funcionário por email
router.get('/profile/:email', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    const decodedEmail = decodeURIComponent(email);
    
    const user = await prisma.user.findUnique({
      where: { email: decodedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }

    // Mapear dados do funcionário baseado no email
    const employeeProfile = {
      ...user,
      department: getUserDepartment(decodedEmail),
      team: getUserTeam(decodedEmail),
      shift: getUserShift(decodedEmail),
      position: getUserPosition(decodedEmail)
    };

    res.json(employeeProfile);
  } catch (error) {
    next(error);
  }
});

// Buscar materiais por departamento
router.get('/materials/:department', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { department } = req.params;
    const materials = getMaterialsByDepartment(department);
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar materiais' });
  }
});

// Buscar ferramentas por departamento
router.get('/tools/:department', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { department } = req.params;
    const tools = getToolsByDepartment(department);
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ferramentas' });
  }
});

// Funções auxiliares para mapear dados dos funcionários
function getUserDepartment(email: string): string {
  const emailToDepartment: { [key: string]: string } = {
    'maria.substrato@mrp2cpu.com.br': 'Montagem Substrato',
    'pedro.substrato@mrp2cpu.com.br': 'Montagem Substrato',
    'ana.bonding@mrp2cpu.com.br': 'Bonding',
    'lucas.bonding@mrp2cpu.com.br': 'Bonding',
    'patricia.encaps@mrp2cpu.com.br': 'Encapsulamento',
    'rodrigo.encaps@mrp2cpu.com.br': 'Encapsulamento',
    'fernanda.teste@mrp2cpu.com.br': 'Testes',
    'rafael.teste@mrp2cpu.com.br': 'Testes',
    'juliana.embalagem@mrp2cpu.com.br': 'Embalagem',
    'marcos.embalagem@mrp2cpu.com.br': 'Embalagem'
  };
  return emailToDepartment[email] || 'Produção';
}

function getUserTeam(email: string): string {
  const emailToTeam: { [key: string]: string } = {
    'maria.substrato@mrp2cpu.com.br': 'Equipe Substrato',
    'pedro.substrato@mrp2cpu.com.br': 'Equipe Substrato',
    'ana.bonding@mrp2cpu.com.br': 'Equipe Bonding',
    'lucas.bonding@mrp2cpu.com.br': 'Equipe Bonding',
    'patricia.encaps@mrp2cpu.com.br': 'Equipe Encapsulamento',
    'rodrigo.encaps@mrp2cpu.com.br': 'Equipe Encapsulamento',
    'fernanda.teste@mrp2cpu.com.br': 'Equipe Testes',
    'rafael.teste@mrp2cpu.com.br': 'Equipe Testes',
    'juliana.embalagem@mrp2cpu.com.br': 'Equipe Embalagem',
    'marcos.embalagem@mrp2cpu.com.br': 'Equipe Embalagem'
  };
  return emailToTeam[email] || 'Equipe A';
}

function getUserShift(email: string): string {
  const emailToShift: { [key: string]: string } = {
    'maria.substrato@mrp2cpu.com.br': 'Turno A (06:00-14:00)',
    'pedro.substrato@mrp2cpu.com.br': 'Turno A (06:00-14:00)',
    'ana.bonding@mrp2cpu.com.br': 'Turno A (06:00-14:00)',
    'lucas.bonding@mrp2cpu.com.br': 'Turno A (06:00-14:00)',
    'patricia.encaps@mrp2cpu.com.br': 'Turno B (14:00-22:00)',
    'rodrigo.encaps@mrp2cpu.com.br': 'Turno B (14:00-22:00)',
    'fernanda.teste@mrp2cpu.com.br': 'Turno B (14:00-22:00)',
    'rafael.teste@mrp2cpu.com.br': 'Turno B (14:00-22:00)',
    'juliana.embalagem@mrp2cpu.com.br': 'Turno C (22:00-06:00)',
    'marcos.embalagem@mrp2cpu.com.br': 'Turno C (22:00-06:00)'
  };
  return emailToShift[email] || 'Turno A (06:00-14:00)';
}

function getUserPosition(email: string): string {
  const emailToPosition: { [key: string]: string } = {
    'maria.substrato@mrp2cpu.com.br': 'Operadora de Montagem de Substrato',
    'pedro.substrato@mrp2cpu.com.br': 'Técnico de Substrato',
    'ana.bonding@mrp2cpu.com.br': 'Operadora de Wire Bonding',
    'lucas.bonding@mrp2cpu.com.br': 'Técnico de Bonding',
    'patricia.encaps@mrp2cpu.com.br': 'Operadora de Encapsulamento',
    'rodrigo.encaps@mrp2cpu.com.br': 'Técnico de Moldagem',
    'fernanda.teste@mrp2cpu.com.br': 'Operadora de Teste de CPU',
    'rafael.teste@mrp2cpu.com.br': 'Técnico de Testes Elétricos',
    'juliana.embalagem@mrp2cpu.com.br': 'Operadora de Embalagem de CPUs',
    'marcos.embalagem@mrp2cpu.com.br': 'Técnico de Expedição'
  };
  return emailToPosition[email] || 'Operador';
}

function getMaterialsByDepartment(department: string) {
  const materialsByDept: { [key: string]: any[] } = {
    'Montagem Substrato': [
      { name: 'Substrato Cerâmico', quantity: 100, unit: 'peças' },
      { name: 'Pasta Condutiva', quantity: 5, unit: 'tubos' },
      { name: 'Componentes SMD', quantity: 200, unit: 'peças' }
    ],
    'Bonding': [
      { name: 'Fios de Ouro', quantity: 50, unit: 'metros' },
      { name: 'Capillary Tools', quantity: 10, unit: 'peças' },
      { name: 'Bonding Wire', quantity: 25, unit: 'rolos' }
    ],
    'Encapsulamento': [
      { name: 'Resina Epóxi', quantity: 20, unit: 'kg' },
      { name: 'Moldes de Encapsulamento', quantity: 15, unit: 'peças' },
      { name: 'Agente Desmoldante', quantity: 3, unit: 'litros' }
    ],
    'Testes': [
      { name: 'Sockets de Teste', quantity: 30, unit: 'peças' },
      { name: 'Cabos de Teste', quantity: 20, unit: 'peças' },
      { name: 'Cartões de Teste', quantity: 10, unit: 'peças' }
    ],
    'Embalagem': [
      { name: 'Bandejas Antiestáticas', quantity: 100, unit: 'peças' },
      { name: 'Filme Plástico ESD', quantity: 5, unit: 'rolos' },
      { name: 'Etiquetas de Identificação', quantity: 500, unit: 'peças' }
    ]
  };
  return materialsByDept[department] || materialsByDept['Montagem Substrato'];
}

function getToolsByDepartment(department: string) {
  const toolsByDept: { [key: string]: any[] } = {
    'Montagem Substrato': [
      { name: 'Microscópio de Inspeção', quantity: 1 },
      { name: 'Alicate de Precisão', quantity: 2 },
      { name: 'Multímetro Digital', quantity: 1 }
    ],
    'Bonding': [
      { name: 'Wire Bonder ASM AB339', quantity: 1 },
      { name: 'Microscópio de Bonding', quantity: 1 },
      { name: 'Ferramentas de Calibração', quantity: 3 }
    ],
    'Encapsulamento': [
      { name: 'Molding Press APIC', quantity: 1 },
      { name: 'Termômetro Digital', quantity: 2 },
      { name: 'Ferramentas de Moldagem', quantity: 5 }
    ],
    'Testes': [
      { name: 'Testador ATE Advantest', quantity: 1 },
      { name: 'Osciloscópio Digital', quantity: 1 },
      { name: 'Gerador de Sinais', quantity: 1 }
    ],
    'Embalagem': [
      { name: 'Seladora de Bandejas', quantity: 1 },
      { name: 'Impressora de Etiquetas', quantity: 1 },
      { name: 'Teste de ESD', quantity: 1 }
    ]
  };
  return toolsByDept[department] || toolsByDept['Montagem Substrato'];
}

export default router; 