import express from 'express';
import cors from 'cors';
import ordersRoutes from './routes/orders';
import inventoryRoutes from './routes/inventory';

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/orders', ordersRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'MRP2 Backend API funcionando!',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'MRP2 Backend API',
        status: 'running',
        version: '2.0.0',
        endpoints: [
            'GET /api/health',
            'GET /api/orders',
            'GET /api/orders/cpu-types',
            'GET /api/inventory/items',
            'GET /api/inventory/tools'
        ]
    });
});

// 404 handler
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        message: 'A rota solicitada não existe'
    });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 MRP2 Backend Server rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 Orders API: http://localhost:${PORT}/api/orders`);
    console.log(`📦 Inventory API: http://localhost:${PORT}/api/inventory`);
    console.log(`🌐 Frontend deve acessar via proxy do Vite`);
}); 