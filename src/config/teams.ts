interface Tool {
    id: number;
    name: string;
    description: string;
}

interface Material {
    id: number;
    name: string;
    type: string;
}

interface TeamConfig {
    id: string;
    name: string;
    description: string;
    responsibilities: string[];
    tools: Tool[];
    materials: Material[];
    specificProcedures: string[];
}

export const teamsConfig: Record<string, TeamConfig> = {
    'quality-components': {
        id: 'quality-components',
        name: 'Equipe Qualidade de Componentes',
        description: 'Responsável pela verificação e teste de todos os componentes antes da montagem',
        responsibilities: [
            'Inspeção visual de componentes',
            'Testes de funcionamento',
            'Validação de especificações',
            'Controle de qualidade'
        ],
        tools: [
            { id: 1, name: 'Multímetro Digital', description: 'Para testes elétricos' },
            { id: 2, name: 'Microscópio Digital', description: 'Para inspeção detalhada' },
            { id: 3, name: 'Testador de Componentes', description: 'Para validação funcional' }
        ],
        materials: [
            { id: 1, name: 'Kit de Limpeza', type: 'Manutenção' },
            { id: 2, name: 'Luvas Anti-estática', type: 'EPI' }
        ],
        specificProcedures: [
            'Protocolo de teste de CPUs',
            'Checklist de validação de componentes',
            'Procedimento de registro de defeitos'
        ]
    },
    'assembly-a': {
        id: 'assembly-a',
        name: 'Equipe Montagem A',
        description: 'Especializada na montagem de CPUs de alto desempenho',
        responsibilities: [
            'Montagem de placas-mãe',
            'Instalação de processadores',
            'Montagem de sistemas de refrigeração',
            'Configuração inicial'
        ],
        tools: [
            { id: 1, name: 'Kit de Chaves de Precisão', description: 'Para montagem detalhada' },
            { id: 2, name: 'Pasta Térmica', description: 'Para processadores' },
            { id: 3, name: 'Ferramenta de Crimping', description: 'Para cabos' }
        ],
        materials: [
            { id: 1, name: 'Parafusos Especiais', type: 'Consumível' },
            { id: 2, name: 'Pasta Térmica', type: 'Consumível' }
        ],
        specificProcedures: [
            'Protocolo de montagem de CPUs gaming',
            'Checklist de instalação de water cooler',
            'Procedimento de cable management'
        ]
    },
    'assembly-b': {
        id: 'assembly-b',
        name: 'Equipe Montagem B',
        description: 'Focada na montagem de CPUs corporativos e servidores',
        responsibilities: [
            'Montagem de servidores',
            'Configuração RAID',
            'Instalação de redundância',
            'Testes de estabilidade'
        ],
        tools: [
            { id: 1, name: 'Kit de Montagem Servidor', description: 'Para chassis especiais' },
            { id: 2, name: 'Testador de Fonte', description: 'Para fontes redundantes' }
        ],
        materials: [
            { id: 1, name: 'Parafusos Rack', type: 'Consumível' },
            { id: 2, name: 'Etiquetas de Identificação', type: 'Consumível' }
        ],
        specificProcedures: [
            'Protocolo de montagem de servidores',
            'Checklist de configuração RAID',
            'Procedimento de teste de redundância'
        ]
    },
    'quality-software': {
        id: 'quality-software',
        name: 'Equipe Qualidade de Software',
        description: 'Responsável pelos testes de software e configuração dos sistemas',
        responsibilities: [
            'Instalação de sistemas',
            'Testes de performance',
            'Validação de software',
            'Benchmarking'
        ],
        tools: [
            { id: 1, name: 'Drives de Boot', description: 'Para instalação de sistemas' },
            { id: 2, name: 'Software de Benchmark', description: 'Para testes de performance' }
        ],
        materials: [
            { id: 1, name: 'Licenças de Software', type: 'Digital' },
            { id: 2, name: 'Mídias de Instalação', type: 'Digital' }
        ],
        specificProcedures: [
            'Protocolo de instalação de sistemas',
            'Checklist de testes de software',
            'Procedimento de benchmark'
        ]
    },
    'packaging': {
        id: 'packaging',
        name: 'Equipe Empacotamento',
        description: 'Responsável pelo empacotamento e preparação final dos produtos',
        responsibilities: [
            'Inspeção final',
            'Empacotamento',
            'Etiquetagem',
            'Preparação para envio'
        ],
        tools: [
            { id: 1, name: 'Scanner de Código', description: 'Para registro de produtos' },
            { id: 2, name: 'Seladora', description: 'Para embalagens' }
        ],
        materials: [
            { id: 1, name: 'Caixas', type: 'Embalagem' },
            { id: 2, name: 'Material de Proteção', type: 'Embalagem' },
            { id: 3, name: 'Etiquetas', type: 'Consumível' }
        ],
        specificProcedures: [
            'Protocolo de embalagem',
            'Checklist de inspeção final',
            'Procedimento de etiquetagem'
        ]
    },
    'maintenance': {
        id: 'maintenance',
        name: 'Equipe de Manutenção',
        description: 'Responsável pela manutenção preventiva e corretiva dos equipamentos',
        responsibilities: [
            'Manutenção preventiva',
            'Manutenção corretiva',
            'Gestão de peças de reposição',
            'Diagnóstico de problemas',
            'Calibração de equipamentos'
        ],
        tools: [
            { id: 1, name: 'Kit de Ferramentas Completo', description: 'Para manutenção geral' },
            { id: 2, name: 'Multímetro Industrial', description: 'Para diagnósticos elétricos' },
            { id: 3, name: 'Calibradores', description: 'Para ajuste de equipamentos' },
            { id: 4, name: 'Osciloscópio', description: 'Para análise de sinais' }
        ],
        materials: [
            { id: 1, name: 'Peças de Reposição', type: 'Componentes' },
            { id: 2, name: 'Lubrificantes', type: 'Consumível' },
            { id: 3, name: 'EPIs', type: 'Segurança' },
            { id: 4, name: 'Materiais de Limpeza', type: 'Consumível' }
        ],
        specificProcedures: [
            'Protocolo de manutenção preventiva',
            'Checklist de inspeção de equipamentos',
            'Procedimento de manutenção corretiva',
            'Gestão de ordem de serviço',
            'Controle de peças e materiais'
        ]
    }
}; 