import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🖥️ Iniciando seed da FÁBRICA DE CPUs - MRP2 Systems...');

  // 🏢 ADMINISTRAÇÃO (1 pessoa)
  const adminUsers = [
    {
      email: 'carlos.diretor@mrp2cpu.com.br',
      name: 'Carlos Roberto Silva',
      password: 'admin123',
      role: 'admin',
      department: 'Administração',
      position: 'Diretor de Operações'
    }
  ];

  // 🔧 MANUTENÇÃO (1 pessoa)
  const maintenanceUsers = [
    {
      email: 'joao.manutencao@mrp2cpu.com.br',
      name: 'João Paulo Santos',
      password: 'manutencao123',
      role: 'maintenance',
      department: 'Manutenção',
      position: 'Técnico de Manutenção Eletrônica'
    }
  ];

  // 👷 EQUIPES DE PRODUÇÃO DE CPUs (2 pessoas por equipe)
  const employeeUsers = [
    // EQUIPE 1: MONTAGEM DE SUBSTRATO
    {
      email: 'maria.substrato@mrp2cpu.com.br',
      name: 'Maria Fernanda Costa',
      password: 'funcionario123',
      role: 'employee',
      department: 'Montagem Substrato',
      position: 'Operadora de Montagem de Substrato',
      shift: 'Turno A (06:00-14:00)',
      team: 'Equipe Substrato'
    },
    {
      email: 'pedro.substrato@mrp2cpu.com.br',
      name: 'Pedro Henrique Lima',
      password: 'funcionario123',
      role: 'employee',
      department: 'Montagem Substrato',
      position: 'Técnico de Substrato',
      shift: 'Turno A (06:00-14:00)',
      team: 'Equipe Substrato'
    },

    // EQUIPE 2: BONDING (Ligação de Dies)
    {
      email: 'ana.bonding@mrp2cpu.com.br',
      name: 'Ana Paula Oliveira',
      password: 'funcionario123',
      role: 'employee',
      department: 'Bonding',
      position: 'Operadora de Wire Bonding',
      shift: 'Turno A (06:00-14:00)',
      team: 'Equipe Bonding'
    },
    {
      email: 'lucas.bonding@mrp2cpu.com.br',
      name: 'Lucas Gabriel Santos',
      password: 'funcionario123',
      role: 'employee',
      department: 'Bonding',
      position: 'Técnico de Bonding',
      shift: 'Turno A (06:00-14:00)',
      team: 'Equipe Bonding'
    },

    // EQUIPE 3: ENCAPSULAMENTO
    {
      email: 'patricia.encaps@mrp2cpu.com.br',
      name: 'Patrícia Silva Rocha',
      password: 'funcionario123',
      role: 'employee',
      department: 'Encapsulamento',
      position: 'Operadora de Encapsulamento',
      shift: 'Turno B (14:00-22:00)',
      team: 'Equipe Encapsulamento'
    },
    {
      email: 'rodrigo.encaps@mrp2cpu.com.br',
      name: 'Rodrigo Alves Pereira',
      password: 'funcionario123',
      role: 'employee',
      department: 'Encapsulamento',
      position: 'Técnico de Moldagem',
      shift: 'Turno B (14:00-22:00)',
      team: 'Equipe Encapsulamento'
    },

    // EQUIPE 4: TESTES E QUALIDADE
    {
      email: 'fernanda.teste@mrp2cpu.com.br',
      name: 'Fernanda Martins Costa',
      password: 'funcionario123',
      role: 'employee',
      department: 'Testes',
      position: 'Operadora de Teste de CPU',
      shift: 'Turno B (14:00-22:00)',
      team: 'Equipe Testes'
    },
    {
      email: 'rafael.teste@mrp2cpu.com.br',
      name: 'Rafael Santos Silva',
      password: 'funcionario123',
      role: 'employee',
      department: 'Testes',
      position: 'Técnico de Testes Elétricos',
      shift: 'Turno B (14:00-22:00)',
      team: 'Equipe Testes'
    },

    // EQUIPE 5: EMBALAGEM E EXPEDIÇÃO
    {
      email: 'juliana.embalagem@mrp2cpu.com.br',
      name: 'Juliana Campos Santos',
      password: 'funcionario123',
      role: 'employee',
      department: 'Embalagem',
      position: 'Operadora de Embalagem de CPUs',
      shift: 'Turno C (22:00-06:00)',
      team: 'Equipe Embalagem'
    },
    {
      email: 'marcos.embalagem@mrp2cpu.com.br',
      name: 'Marcos Vinícius Oliveira',
      password: 'funcionario123',
      role: 'employee',
      department: 'Embalagem',
      position: 'Técnico de Expedição',
      shift: 'Turno C (22:00-06:00)',
      team: 'Equipe Embalagem'
    }
  ];

  // Combinar todos os usuários
  const allUsers = [...adminUsers, ...maintenanceUsers, ...employeeUsers];

  // Criar usuários no banco
  console.log('👥 Criando equipe da fábrica de CPUs...');
  const createdUsers: any[] = [];
  for (const userData of allUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        role: userData.role
      }
    });
    
    createdUsers.push(user);
    console.log(`✅ ${(userData as any).team || userData.department}: ${userData.name} (${userData.position})`);
  }

  // 🔧 SOLICITAÇÕES DE MANUTENÇÃO ESPECÍFICAS PARA FÁBRICA DE CPUs
  const maintenanceRequests = [
    {
      equipment: 'Máquina de Wire Bonding ASM AB339',
      description: 'Precisão do fio de ouro fora do padrão. Necessário calibração urgente do sistema de posicionamento. Afetando qualidade das conexões die-substrato.',
      priority: 'Alta',
      status: 'Pendente',
      requestedBy: createdUsers.find(u => u.email === 'ana.bonding@mrp2cpu.com.br')?.id || createdUsers[2].id,
      requestedAt: new Date('2024-12-20T09:15:00'),
      department: 'Bonding'
    },
    {
      equipment: 'Sistema de Teste ATE Advantest T2000',
      description: 'Testador de CPUs apresentando falhas intermitentes no canal 3. Alguns processadores aprovados incorretamente. Manutenção preventiva semanal.',
      priority: 'Alta',
      status: 'Em Andamento',
      requestedBy: createdUsers.find(u => u.email === 'rafael.teste@mrp2cpu.com.br')?.id || createdUsers[7].id,
      requestedAt: new Date('2024-12-19T15:30:00'),
      department: 'Testes'
    },
    {
      equipment: 'Molding Press APIC Yamada YAP-300',
      description: 'Temperatura do molde instável durante encapsulamento. Variação de ±3°C detectada. Necessário verificar sistema de aquecimento.',
      priority: 'Média',
      status: 'Agendada',
      requestedBy: createdUsers.find(u => u.email === 'rodrigo.encaps@mrp2cpu.com.br')?.id || createdUsers[5].id,
      requestedAt: new Date('2024-12-18T11:45:00'),
      department: 'Encapsulamento'
    },
    {
      equipment: 'Pick & Place Machine ASMPT SIPLACE',
      description: 'Ventosas de sucção com perda de vácuo. Componentes sendo colocados fora de posição no substrato. Troca de selo necessária.',
      priority: 'Média',
      status: 'Pendente',
      requestedBy: createdUsers.find(u => u.email === 'maria.substrato@mrp2cpu.com.br')?.id || createdUsers[1].id,
      requestedAt: new Date('2024-12-20T07:20:00'),
      department: 'Montagem Substrato'
    },
    {
      equipment: 'Máquina de Marcação Laser Coherent AVIA',
      description: 'CONCLUÍDO: Laser com potência reduzida. Marcação dos códigos dos CPUs estava fraca. Substituído módulo laser e recalibrado sistema.',
      priority: 'Baixa',
      status: 'Concluída',
      requestedBy: createdUsers.find(u => u.email === 'juliana.embalagem@mrp2cpu.com.br')?.id || createdUsers[8].id,
      requestedAt: new Date('2024-12-15T13:10:00'),
      department: 'Embalagem'
    },
    {
      equipment: 'Sistema de Visão COGNEX In-Sight 9000',
      description: 'Câmeras de inspeção desalinhadas após limpeza. Falso rejeitados em CPUs bons. Recalibração do sistema de visão necessária.',
      priority: 'Alta',
      status: 'Agendada',
      requestedBy: createdUsers.find(u => u.email === 'fernanda.teste@mrp2cpu.com.br')?.id || createdUsers[6].id,
      requestedAt: new Date('2024-12-17T16:00:00'),
      department: 'Testes'
    }
  ];

  // Criar solicitações de manutenção
  console.log('🔧 Criando solicitações de manutenção da fábrica de CPUs...');
  for (const request of maintenanceRequests) {
    await prisma.maintenanceRequest.create({
      data: request
    });
    console.log(`✅ Manutenção: ${request.equipment.split(' ')[0]} - ${request.status}`);
  }

  console.log('🖥️ Fábrica de CPUs configurada com sucesso!');
  console.log(`
🏭 RESUMO DA FÁBRICA DE CPUs MRP2:
┌─────────────────────────────────────────┐
│ 👥 ORGANIZAÇÃO DA EQUIPE:               │
│ • Administração: 1 pessoa               │
│ • Manutenção: 1 técnico especializado   │  
│ • Produção: 5 equipes de 2 pessoas      │
│ • TOTAL: 12 funcionários                │
├─────────────────────────────────────────┤
│ 🔧 SOLICITAÇÕES DE MANUTENÇÃO: 6        │
│ • Pendentes: 2                          │
│ • Em Andamento: 1                       │
│ • Agendadas: 2                          │
│ • Concluídas: 1                         │
├─────────────────────────────────────────┤
│ 🏭 LINHAS DE PRODUÇÃO:                  │
│ 1️⃣ Montagem de Substrato (2 pessoas)    │
│ 2️⃣ Wire Bonding (2 pessoas)             │
│ 3️⃣ Encapsulamento (2 pessoas)           │
│ 4️⃣ Testes Elétricos (2 pessoas)         │
│ 5️⃣ Embalagem/Expedição (2 pessoas)      │
└─────────────────────────────────────────┘

🔑 ACESSOS DO SISTEMA:
• Diretor: carlos.diretor@mrp2cpu.com.br / admin123
• Manutenção: joao.manutencao@mrp2cpu.com.br / manutencao123  
• Produção: maria.substrato@mrp2cpu.com.br / funcionario123

🖥️ EQUIPAMENTOS DE PRODUÇÃO DE CPUs:
• Wire Bonding ASM AB339 (Conexões die-substrato)
• Testador ATE Advantest T2000 (Testes elétricos)
• Molding Press APIC Yamada (Encapsulamento)
• Pick & Place ASMPT SIPLACE (Montagem substrato)
• Laser Coherent AVIA (Marcação de códigos)
• Sistema Visão COGNEX (Inspeção qualidade)

🎯 PROCESSO DE FABRICAÇÃO:
Substrato → Bonding → Encapsulamento → Testes → Embalagem
  `);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao configurar fábrica de CPUs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 