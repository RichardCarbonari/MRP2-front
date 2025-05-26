import axios from 'axios';

// Criando uma instância do axios com configurações base
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interface para os dados financeiros
export interface FinancialData {
    operationalCosts: {
        labor: number;
        materials: number;
        equipment: number;
        utilities: number;
        maintenance: number;
        total: number;
    };
    revenue: {
        totalSales: number;
        averageUnitPrice: number;
        unitsProduced: number;
    };
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    monthlyComparison?: {
        grossProfitChange: number;
        netProfitChange: number;
        revenueChange: number;
    };
}

// Interface para os parâmetros de filtro
export interface FinancialFilters {
    startDate?: string;
    endDate?: string;
    department?: string;
    productLine?: string;
}

// Serviço para dados financeiros
export const financialService = {
    // Buscar dados financeiros com filtros opcionais
    getFinancialData: async (filters?: FinancialFilters): Promise<FinancialData> => {
        try {
            const response = await api.get('/financial', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar dados financeiros:', error);
            throw error;
        }
    },

    // Buscar histórico financeiro
    getFinancialHistory: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
        try {
            const response = await api.get(`/financial/history/${period}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar histórico financeiro:', error);
            throw error;
        }
    },

    // Buscar detalhes de custos operacionais
    getOperationalCostsDetails: async (costType: string) => {
        try {
            const response = await api.get(`/financial/costs/${costType}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar detalhes de custos:', error);
            throw error;
        }
    },

    // Enviar atualizações de dados financeiros
    updateFinancialData: async (data: Partial<FinancialData>) => {
        try {
            const response = await api.put('/financial', data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar dados financeiros:', error);
            throw error;
        }
    }
};

export default api; 