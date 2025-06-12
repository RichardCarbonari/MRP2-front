import { Router } from 'express';

const router = Router();

// Mock data para relatórios de qualidade
const qualityReports = [
    {
        id: 'QR001',
        title: 'Relatório de Qualidade - Dezembro 2024',
        type: 'monthly',
        status: 'completed',
        createdAt: '2024-12-15T10:00:00Z',
        updatedAt: '2024-12-15T10:00:00Z',
        summary: {
            totalTests: 156,
            passedTests: 148,
            failedTests: 8,
            passRate: 94.87,
            categories: {
                hardware: { total: 78, passed: 75, failed: 3 },
                software: { total: 45, passed: 43, failed: 2 },
                integration: { total: 33, passed: 30, failed: 3 }
            }
        }
    },
    {
        id: 'QR002', 
        title: 'Relatório Semanal - Semana 50',
        type: 'weekly',
        status: 'in_progress',
        createdAt: '2024-12-12T09:00:00Z',
        updatedAt: '2024-12-16T14:30:00Z',
        summary: {
            totalTests: 45,
            passedTests: 42,
            failedTests: 3,
            passRate: 93.33,
            categories: {
                hardware: { total: 20, passed: 19, failed: 1 },
                software: { total: 15, passed: 14, failed: 1 },
                integration: { total: 10, passed: 9, failed: 1 }
            }
        }
    }
];

// Mock data para métricas de qualidade
const qualityMetrics = {
    overview: {
        totalProducts: 342,
        qualityScore: 94.2,
        defectRate: 5.8,
        customerSatisfaction: 4.6
    },
    trends: {
        lastMonth: {
            qualityScore: 93.1,
            defectRate: 6.9,
            improvement: "+1.1%"
        },
        lastWeek: {
            qualityScore: 95.2,
            defectRate: 4.8,
            improvement: "+2.1%"
        }
    },
    categories: [
        {
            name: 'Hardware Quality',
            score: 96.5,
            trend: 'up',
            issues: 12,
            resolved: 10
        },
        {
            name: 'Software Quality', 
            score: 92.8,
            trend: 'stable',
            issues: 8,
            resolved: 7
        },
        {
            name: 'Integration Tests',
            score: 89.4,
            trend: 'down',
            issues: 15,
            resolved: 11
        }
    ],
    recentIssues: [
        {
            id: 'QI001',
            title: 'GPU não detectada em teste de hardware',
            severity: 'high',
            status: 'resolved',
            reportedAt: '2024-12-15T08:30:00Z',
            resolvedAt: '2024-12-15T14:20:00Z'
        },
        {
            id: 'QI002',
            title: 'Falha em teste de stress de CPU',
            severity: 'medium',
            status: 'in_progress',
            reportedAt: '2024-12-16T10:15:00Z'
        }
    ]
};

// GET /api/quality/reports - Buscar relatórios de qualidade
router.get('/reports', (req, res) => {
    try {
        console.log('✅ GET /api/quality/reports - Buscando relatórios de qualidade');
        res.json(qualityReports);
    } catch (error) {
        console.error('❌ Erro ao buscar relatórios de qualidade:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/quality/metrics - Buscar métricas de qualidade
router.get('/metrics', (req, res) => {
    try {
        console.log('✅ GET /api/quality/metrics - Buscando métricas de qualidade');
        res.json(qualityMetrics);
    } catch (error) {
        console.error('❌ Erro ao buscar métricas de qualidade:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/quality/reports/:id - Buscar relatório específico
router.get('/reports/:id', (req, res) => {
    try {
        const { id } = req.params;
        console.log(`✅ GET /api/quality/reports/${id} - Buscando relatório específico`);
        
        const report = qualityReports.find(r => r.id === id);
        
        if (!report) {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }
        
        res.json(report);
    } catch (error) {
        console.error('❌ Erro ao buscar relatório:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/quality/reports - Criar novo relatório
router.post('/reports', (req, res) => {
    try {
        console.log('✅ POST /api/quality/reports - Criando novo relatório');
        
        const newReport = {
            id: `QR${String(qualityReports.length + 1).padStart(3, '0')}`,
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'in_progress'
        };
        
        qualityReports.push(newReport);
        res.status(201).json(newReport);
    } catch (error) {
        console.error('❌ Erro ao criar relatório:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// PUT /api/quality/reports/:id - Atualizar relatório
router.put('/reports/:id', (req, res) => {
    try {
        const { id } = req.params;
        console.log(`✅ PUT /api/quality/reports/${id} - Atualizando relatório`);
        
        const reportIndex = qualityReports.findIndex(r => r.id === id);
        
        if (reportIndex === -1) {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }
        
        qualityReports[reportIndex] = {
            ...qualityReports[reportIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        res.json(qualityReports[reportIndex]);
    } catch (error) {
        console.error('❌ Erro ao atualizar relatório:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

export default router; 