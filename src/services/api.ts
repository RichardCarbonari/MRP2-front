import axios from 'axios';

// Criando uma instância do axios com configurações base
const api = axios.create({
    baseURL: 'http://localhost:3006/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para adicionar token de autenticação automaticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Interface para os dados de vendas de produtos
export interface ProductSaleData {
    category: string;
    unitsSold: number;
    revenue: number;
    averagePrice: number;
    profitMargin: number;
}

// Interface para os dados financeiros
export interface FinancialData {
    operationalCosts: {
        labor: number;
        components: number;
        logistics: number;
        utilities: number;
        maintenance: number;
        total: number;
    };
    productSales: ProductSaleData[];
    totalRevenue: number;
    totalCosts: number;
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

// Interface para Item de Inventário
export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    value: number;
    unit: string;
    category: string;
    location: string;
    lastUpdated: string; // Date comes as string from API
}

// Interface para Ferramenta
export interface Tool {
    id: string;
    name: string;
    type: string;
    quantity: number;
    condition: 'excellent' | 'good' | 'fair' | 'needs_maintenance';
    location: string;
    lastMaintenance: string; // Date comes as string from API
}

// Serviço para inventário
export const inventoryService = {
    // Buscar todos os itens
    getItems: async (): Promise<InventoryItem[]> => {
        try {
            const response = await api.get('/inventory/items');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
            throw error;
        }
    },

    // Criar novo item
    createItem: async (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem> => {
        try {
            const response = await api.post('/inventory/items', itemData);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar item:', error);
            throw error;
        }
    },

    // Atualizar item
    updateItem: async (id: string, itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem> => {
        try {
            const response = await api.put(`/inventory/items/${id}`, itemData);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
            throw error;
        }
    },

    // Deletar item
    deleteItem: async (id: string): Promise<void> => {
        try {
            await api.delete(`/inventory/items/${id}`);
        } catch (error) {
            console.error('Erro ao deletar item:', error);
            throw error;
        }
    },

    // Buscar todas as ferramentas
    getTools: async (): Promise<Tool[]> => {
        try {
            const response = await api.get('/inventory/tools');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar ferramentas:', error);
            throw error;
        }
    },

    // Criar nova ferramenta
    createTool: async (toolData: Omit<Tool, 'id' | 'lastMaintenance'>): Promise<Tool> => {
        try {
            const response = await api.post('/inventory/tools', toolData);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar ferramenta:', error);
            throw error;
        }
    },

    // Atualizar ferramenta
    updateTool: async (id: string, toolData: Omit<Tool, 'id' | 'lastMaintenance'>): Promise<Tool> => {
        try {
            const response = await api.put(`/inventory/tools/${id}`, toolData);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar ferramenta:', error);
            throw error;
        }
    },

    // Deletar ferramenta
    deleteTool: async (id: string): Promise<void> => {
        try {
            await api.delete(`/inventory/tools/${id}`);
        } catch (error) {
            console.error('Erro ao deletar ferramenta:', error);
            throw error;
        }
    }
};

// Interface para Pedido de CPU
export interface CPUOrder {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    cpuType: string;
    cpuSpecs: {
        processor: string;
        motherboard: string;
        ram: string;
        storage: string;
        gpu?: string;
        powerSupply: string;
        case: string;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    orderDate: string;
    deliveryDate: string;
    status: 'pending' | 'assembly' | 'testing' | 'ready' | 'delivered';
    priority: 'high' | 'medium' | 'low';
    notes: string;
    createdAt: string;
    updatedAt: string;
}

// Interface para tipos de CPU
export interface CPUType {
    name: string;
    price: number;
    specs: {
        processor: string;
        motherboard: string;
        ram: string;
        storage: string;
        gpu?: string;
        powerSupply: string;
        case: string;
    };
}

// Interface para estatísticas de pedidos
export interface OrderStats {
    summary: {
        totalOrders: number;
        pendingOrders: number;
        inProgressOrders: number;
        completedOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
    };
    priorities: {
        high: number;
        medium: number;
        low: number;
    };
    topProducts: Array<{
        cpuType: string;
        name: string;
        orderCount: number;
        totalQuantity: number;
        totalValue: number;
    }>;
}

// Serviço para pedidos
export const ordersService = {
    // Buscar todos os pedidos
    getOrders: async (filters?: { status?: string; priority?: string; customer?: string }): Promise<CPUOrder[]> => {
        try {
            const response = await api.get('/orders', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            throw error;
        }
    },

    // Buscar pedido específico
    getOrder: async (id: string): Promise<CPUOrder> => {
        try {
            const response = await api.get(`/orders/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar pedido:', error);
            throw error;
        }
    },

    // Criar novo pedido
    createOrder: async (orderData: {
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        cpuType: string;
        quantity: number;
        deliveryDate: string;
        priority?: string;
        notes?: string;
    }): Promise<CPUOrder> => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            throw error;
        }
    },

    // Atualizar pedido
    updateOrder: async (id: string, orderData: Partial<{
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        cpuType: string;
        quantity: number;
        deliveryDate: string;
        status: CPUOrder['status'];
        priority: CPUOrder['priority'];
        notes: string;
    }>): Promise<CPUOrder> => {
        try {
            const response = await api.put(`/orders/${id}`, orderData);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            throw error;
        }
    },

    // Deletar pedido
    deleteOrder: async (id: string): Promise<void> => {
        try {
            await api.delete(`/orders/${id}`);
        } catch (error) {
            console.error('Erro ao deletar pedido:', error);
            throw error;
        }
    },

    // Buscar estatísticas dos pedidos
    getOrderStats: async (): Promise<OrderStats> => {
        try {
            const response = await api.get('/orders/stats/summary');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            throw error;
        }
    },

    // Buscar tipos de CPU disponíveis
    getCPUTypes: async (): Promise<Record<string, CPUType>> => {
        try {
            const response = await api.get('/orders/cpu-types');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar tipos de CPU:', error);
            throw error;
        }
    }
};

export default api; 