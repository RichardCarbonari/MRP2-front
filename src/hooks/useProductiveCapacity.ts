import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface CapacidadeRecurso {
    id: number;
    nome: string;
    capacidadeDiaria: number;
    emUso: number;
    cpusEmProcessamento: number;
    tempoPorUnidade: number;
    status: 'normal' | 'atencao' | 'critico';
    proximaDisponibilidade: Date;
    tendencia?: 'subindo' | 'descendo' | 'estavel';
    ultimaAtualizacao: Date;
}

interface MetricasGerais {
    capacidadeTotal: number;
    cpusEmProcessamento: number;
    utilizacaoMedia: number;
    equipesEmSobrecarga: number;
    ultimaAtualizacao: Date;
}

// Simulação de dados do backend
const simularAtualizacaoDados = (dadosAnteriores: CapacidadeRecurso[]): CapacidadeRecurso[] => {
    return dadosAnteriores.map(recurso => {
        const variacao = Math.random() * 10 - 5; // Variação de -5 a +5
        const novoEmUso = Math.max(0, Math.min(100, recurso.emUso + variacao));
        const novoCpusEmProcessamento = Math.floor(Math.random() * (recurso.capacidadeDiaria / 2)) + 1;

        return {
            ...recurso,
            emUso: novoEmUso,
            cpusEmProcessamento: novoCpusEmProcessamento,
            status: novoEmUso > 95 ? 'critico' : novoEmUso > 85 ? 'atencao' : 'normal',
            tendencia: novoEmUso > recurso.emUso ? 'subindo' : novoEmUso < recurso.emUso ? 'descendo' : 'estavel',
            ultimaAtualizacao: new Date(),
            proximaDisponibilidade: new Date(Date.now() + Math.random() * 3600000) // +1h max
        };
    });
};

const calcularMetricas = (recursos: CapacidadeRecurso[]): MetricasGerais => {
    return {
        capacidadeTotal: recursos.reduce((acc, curr) => acc + curr.capacidadeDiaria, 0),
        cpusEmProcessamento: recursos.reduce((acc, curr) => acc + curr.cpusEmProcessamento, 0),
        utilizacaoMedia: Math.round(recursos.reduce((acc, curr) => acc + curr.emUso, 0) / recursos.length),
        equipesEmSobrecarga: recursos.filter(r => r.status === 'critico').length,
        ultimaAtualizacao: new Date()
    };
};

const formatarData = (data: Date): string => {
    return format(data, "dd 'de' MMMM', às' HH:mm:ss", { locale: ptBR });
};

const dadosIniciaisEquipes = [
    {
        id: 1,
        nome: 'Equipe Qualidade de Componentes',
        capacidadeDiaria: 30,
        emUso: 85,
        cpusEmProcessamento: 8,
        tempoPorUnidade: 25,
        status: 'normal' as const,
        proximaDisponibilidade: new Date(),
        ultimaAtualizacao: new Date()
    },
    {
        id: 2,
        nome: 'Equipe Montagem A',
        capacidadeDiaria: 20,
        emUso: 95,
        cpusEmProcessamento: 12,
        tempoPorUnidade: 45,
        status: 'critico' as const,
        proximaDisponibilidade: new Date(),
        ultimaAtualizacao: new Date()
    },
    {
        id: 3,
        nome: 'Equipe Montagem B',
        capacidadeDiaria: 25,
        emUso: 75,
        cpusEmProcessamento: 6,
        tempoPorUnidade: 35,
        status: 'normal' as const,
        proximaDisponibilidade: new Date(),
        ultimaAtualizacao: new Date()
    },
    {
        id: 4,
        nome: 'Equipe Qualidade de Software',
        capacidadeDiaria: 28,
        emUso: 88,
        cpusEmProcessamento: 10,
        tempoPorUnidade: 30,
        status: 'atencao' as const,
        proximaDisponibilidade: new Date(),
        ultimaAtualizacao: new Date()
    },
    {
        id: 5,
        nome: 'Equipe Empacotamento',
        capacidadeDiaria: 35,
        emUso: 65,
        cpusEmProcessamento: 5,
        tempoPorUnidade: 20,
        status: 'normal' as const,
        proximaDisponibilidade: new Date(),
        ultimaAtualizacao: new Date()
    }
];

export const useProductiveCapacity = (intervaloAtualizacao: number = 5000) => {
    const [recursos, setRecursos] = useState<CapacidadeRecurso[]>([]);
    const [metricas, setMetricas] = useState<MetricasGerais | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        const inicializarDados = async () => {
            try {
                const dadosIniciais = simularAtualizacaoDados(dadosIniciaisEquipes);
                setRecursos(dadosIniciais);
                setMetricas(calcularMetricas(dadosIniciais));
                setCarregando(false);
            } catch (error) {
                setErro('Erro ao carregar dados iniciais');
                setCarregando(false);
            }
        };

        inicializarDados();
    }, []);

    useEffect(() => {
        if (carregando || erro) return;

        const intervalId = setInterval(async () => {
            try {
                const dadosAtualizados = simularAtualizacaoDados(recursos);
                setRecursos(dadosAtualizados);
                setMetricas(calcularMetricas(dadosAtualizados));
            } catch (error) {
                setErro('Erro ao atualizar dados');
            }
        }, intervaloAtualizacao);

        return () => clearInterval(intervalId);
    }, [recursos, carregando, erro, intervaloAtualizacao]);

    return {
        recursos,
        metricas,
        carregando,
        erro,
        formatarData
    };
}; 