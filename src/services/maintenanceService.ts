import axios from 'axios';

// Usar /api/ que será redirecionado pelo proxy do Vite
const API_URL = '/api/maintenance';

// Configuração global do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔑 Token encontrado:', token ? 'SIM' : 'NÃO');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token adicionado ao header:', config.headers.Authorization);
    }
    console.log('📡 Fazendo requisição para:', config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erro no interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para resposta
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ Erro na resposta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 403) {
        console.error('❌ Acesso negado: Verifique se você tem permissão de administrador');
      }
    }
    return Promise.reject(error);
  }
);

export interface MaintenanceRequest {
  id: string;
  equipment: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'Pendente' | 'Em Andamento' | 'Agendada' | 'Concluída';
  requestedBy: string;
  requestedAt: string;
  department: string;
  updatedAt: string;
  // Campos adicionais para equipe de manutenção
  requestedByName?: string;
  requestedByEmail?: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export interface CreateMaintenanceRequest {
  equipment: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  department: string;
}

export interface MaintenanceStats {
  total: number;
  pending: number;
  inProgress: number;
  completedToday: number;
  highPriorityPending: number;
}

export interface UpdateMaintenanceRequest {
  status: 'Pendente' | 'Em Andamento' | 'Agendada' | 'Concluída';
  solution?: string;
  notes?: string;
}

const handleApiError = (error: any) => {
  if (error.response) {
    // O servidor respondeu com um status de erro
    throw new Error(error.response.data.message || 'Erro no servidor');
  } else if (error.request) {
    // A requisição foi feita mas não houve resposta
    throw new Error('Não foi possível conectar ao servidor');
  } else {
    // Erro na configuração da requisição
    throw new Error('Erro ao processar a requisição');
  }
};

const maintenanceService = {
  // 📋 FUNCIONALIDADES PARA FUNCIONÁRIOS

  // Criar uma nova solicitação de manutenção
  createRequest: async (request: CreateMaintenanceRequest): Promise<MaintenanceRequest> => {
    try {
      const response = await api.post('/requests', request);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error; // Para TypeScript inferir o tipo corretamente
    }
  },

  // Listar solicitações do usuário logado
  getUserRequests: async (): Promise<MaintenanceRequest[]> => {
    try {
      const response = await api.get('/requests');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Atualizar o status de uma solicitação (uso geral)
  updateRequestStatus: async (id: string, status: string): Promise<MaintenanceRequest> => {
    try {
      const response = await api.put(`/requests/${id}`, { status });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // 🔧 FUNCIONALIDADES PARA EQUIPE DE MANUTENÇÃO

  // Listar TODOS os pedidos (para equipe de manutenção)
  getAllRequests: async (filters?: { status?: string; priority?: string }): Promise<MaintenanceRequest[]> => {
    try {
      console.log('🔧 getAllRequests chamado com filtros:', filters);
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      
      const url = `/all-requests${params.toString() ? '?' + params.toString() : ''}`;
      console.log('🔧 URL da requisição:', url);
      
      const response = await api.get(url);
      console.log('✅ Resposta recebida:', response.data.length, 'solicitações');
      return response.data;
    } catch (error) {
      console.error('❌ Erro em getAllRequests:', error);
      handleApiError(error);
      throw error;
    }
  },

  // Atribuir um pedido para a equipe de manutenção
  assignRequest: async (id: string, assignedTo: string, notes?: string): Promise<MaintenanceRequest> => {
    try {
      const response = await api.put(`/requests/${id}/assign`, { assignedTo, notes });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Atualizar pedido com solução e observações
  updateRequest: async (id: string, updateData: UpdateMaintenanceRequest): Promise<MaintenanceRequest> => {
    try {
      const response = await api.put(`/requests/${id}/update`, updateData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Obter estatísticas para dashboard
  getStats: async (): Promise<MaintenanceStats> => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // 🔧 FUNCIONALIDADES MOCKADAS (TEMPORÁRIAS)
  
  // Buscar dados mockados realistas de máquinas industriais
  getMockRequests: async (): Promise<MaintenanceRequest[]> => {
    try {
      const response = await api.get('/mock-requests');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Funções auxiliares
  
  // Obter cor da prioridade
  getPriorityColor: (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return '#f44336';
      case 'média':
        return '#ff9800';
      case 'baixa':
        return '#4caf50';
      default:
        return '#757575';
    }
  },

  // Obter cor do status
  getStatusColor: (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return '#ff9800';
      case 'em andamento':
        return '#2196f3';
      case 'agendada':
        return '#9c27b0';
      case 'concluída':
        return '#4caf50';
      default:
        return '#757575';
    }
  },

  // Obter ícone do status
  getStatusIcon: (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'pending';
      case 'em andamento':
        return 'build';
      case 'agendada':
        return 'schedule';
      case 'concluída':
        return 'check_circle';
      default:
        return 'help';
    }
  },

  // Excluir solicitação concluída
  deleteRequest: async (id: string): Promise<void> => {
    try {
      await api.delete(`/requests/${id}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

export default maintenanceService; 