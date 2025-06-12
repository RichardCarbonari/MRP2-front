import api from './api';

export interface QualityReport {
  id: string;
  title: string;
  type: 'hardware' | 'software' | 'integration';
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved';
  notes?: string;
  resolution?: string;
  reportedBy: string;
  reportedByName?: string;
  reportedByEmail?: string;
  createdAt: string;
  updatedAt: string;
  timeRemaining?: string;
  user: {
    name: string;
    email: string;
  };
}

export interface QualityMetrics {
  overview: {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    resolutionRate: number;
  };
  byCategory: {
    category: string;
    _count: number;
  }[];
  byType: {
    type: string;
    _count: number;
  }[];
}

const qualityService = {
  // Buscar todos os relatórios de qualidade
  getAllReports: async (): Promise<QualityReport[]> => {
    try {
      const response = await api.get('/quality/reports');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatórios de qualidade:', error);
      throw error;
    }
  },

  // Criar novo relatório de qualidade
  createReport: async (report: Omit<QualityReport, 'id' | 'reportedBy' | 'createdAt' | 'updatedAt'>): Promise<QualityReport> => {
    try {
      const response = await api.post('/quality/reports', report);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar relatório de qualidade:', error);
      throw error;
    }
  },

  // Atualizar relatório de qualidade
  updateReport: async (id: string, data: { status: string; resolution?: string }): Promise<QualityReport> => {
    try {
      const response = await api.put(`/quality/reports/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar relatório de qualidade:', error);
      throw error;
    }
  },

  // Buscar métricas de qualidade
  getMetrics: async (): Promise<QualityMetrics> => {
    try {
      const response = await api.get('/quality/metrics');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar métricas de qualidade:', error);
      throw error;
    }
  }
};

export default qualityService; 