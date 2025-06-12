# 🔧 Guia Técnico - MRP2 Sistema de Manufatura

Guia técnico completo para desenvolvedores, administradores de sistema e troubleshooting do MRP2.

## 📋 Índice

- [Configuração do Ambiente](#configuração-do-ambiente)
- [Troubleshooting Comum](#troubleshooting-comum)
- [Performance e Otimização](#performance-e-otimização)
- [Monitoramento](#monitoramento)
- [Backup e Recuperação](#backup-e-recuperação)
- [Deploy em Produção](#deploy-em-produção)
- [Manutenção do Sistema](#manutenção-do-sistema)
- [APIs Externas](#apis-externas)
- [Logs e Debugging](#logs-e-debugging)

## 🛠️ Configuração do Ambiente

### Requisitos do Sistema

```bash
# Versões mínimas requeridas
Node.js: 18.0.0+
npm: 9.0.0+
Git: 2.30.0+

# Sistemas operacionais suportados
- Windows 10/11
- macOS 12+
- Ubuntu 20.04+
- CentOS 8+
```

### Configuração Completa do Desenvolvimento

```bash
# 1. Clone e configuração inicial
git clone <repository-url>
cd MRP2-front

# 2. Configuração do Frontend
npm install --legacy-peer-deps
npm audit fix --force

# 3. Configuração do Backend
cd backend
npm install
cp .env.example .env

# 4. Configuração do Banco de Dados
npx prisma generate
npx prisma db push
npm run seed

# 5. Verificação da instalação
npm run test:install
```

### Variáveis de Ambiente

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3006/api
VITE_APP_NAME=MRP2 CPU Manufacturing
VITE_APP_VERSION=1.0.0
VITE_ENABLE_LOGS=true
```

#### Backend (.env)
```env
# Banco de Dados
DATABASE_URL="file:./dev.db"

# Autenticação
JWT_SECRET="mrp2-super-secret-key-2024"
JWT_EXPIRES_IN="24h"

# Servidor
PORT=3006
NODE_ENV=development

# Upload de Arquivos
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"

# Email (futuro)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Logs
LOG_LEVEL=debug
LOG_FILE=./logs/app.log
```

## 🚨 Troubleshooting Comum

### Problemas de Instalação

#### Erro: "Could not resolve react"
```bash
# Solução 1: Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Solução 2: Forçar resolução de dependências
npm install --force
npm install react@18 react-dom@18 --save

# Solução 3: Verificar versões
npm ls react react-dom
```

#### Erro: "Port 3000 is already in use"
```bash
# Encontrar processo usando a porta
netstat -ano | findstr :3000  # Windows
lsof -ti:3000                 # macOS/Linux

# Matar processo
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # macOS/Linux

# Usar porta alternativa
npm run dev -- --port 3001
```

#### Erro: "Prisma Client not generated"
```bash
# Regenerar cliente Prisma
cd backend
npx prisma generate
npx prisma db push

# Verificar schema
npx prisma validate
npx prisma format
```

### Problemas de Autenticação

#### Erro 401: "Token inválido"
```typescript
// Verificar token no localStorage
console.log('Token:', localStorage.getItem('token'));

// Verificar expiração do token
const token = localStorage.getItem('token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Expira em:', new Date(payload.exp * 1000));
}

// Limpar tokens corrompidos
localStorage.removeItem('token');
localStorage.removeItem('user');
```

#### Erro: "CORS policy"
```typescript
// Verificar configuração CORS no backend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  credentials: true
};
```

### Problemas de Banco de Dados

#### Erro: "Database locked"
```bash
# Verificar conexões ativas
npx prisma studio

# Resetar banco de dados
cd backend
rm prisma/dev.db
npx prisma db push
npm run seed
```

#### Erro: "Foreign key constraint failed"
```sql
-- Verificar integridade referencial
PRAGMA foreign_keys = ON;
PRAGMA integrity_check;

-- Verificar relacionamentos
SELECT * FROM User WHERE id NOT IN (SELECT DISTINCT requestedBy FROM MaintenanceRequest);
```

## ⚡ Performance e Otimização

### Frontend

#### Bundle Analysis
```bash
# Analisar tamanho do bundle
npm run build
npm run preview

# Usar webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer
npm run analyze
```

#### Otimizações React
```typescript
// Lazy loading de páginas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

// Memoização de componentes pesados
const ExpensiveComponent = React.memo(({ data }) => {
  return <ComplexVisualization data={data} />;
});

// Debounce em inputs de busca
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

### Backend

#### Otimização de Queries
```typescript
// Usar select específico
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // Não incluir password
  }
});

// Paginação
const requests = await prisma.maintenanceRequest.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
});

// Incluir relacionamentos necessários
const requestsWithUser = await prisma.maintenanceRequest.findMany({
  include: {
    user: {
      select: { name: true, email: true }
    }
  }
});
```

#### Cache de Dados
```typescript
// Cache simples em memória
const cache = new Map();

export const getCachedData = async (key: string, fetcher: () => Promise<any>) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetcher();
  cache.set(key, data);
  
  // Expirar cache após 5 minutos
  setTimeout(() => cache.delete(key), 5 * 60 * 1000);
  
  return data;
};
```

## 📊 Monitoramento

### Métricas do Sistema

```typescript
// Middleware de métricas
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    
    console.log({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};
```

### Health Check Endpoint

```typescript
// GET /api/health
router.get('/health', async (req, res) => {
  try {
    // Verificar conexão com banco
    await prisma.$queryRaw`SELECT 1`;
    
    // Verificar espaço em disco
    const stats = await fs.promises.stat('./');
    
    // Verificar memória
    const memoryUsage = process.memoryUsage();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
      },
      database: 'connected',
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

## 💾 Backup e Recuperação

### Backup Automático do Banco

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DB_FILE="./prisma/dev.db"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Fazer backup do banco
cp $DB_FILE "$BACKUP_DIR/backup_$DATE.db"

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "backup_*.db" -type f -mtime +7 -delete

echo "Backup criado: backup_$DATE.db"
```

### Script de Recuperação

```bash
#!/bin/bash
# restore.sh

if [ -z "$1" ]; then
  echo "Uso: ./restore.sh <arquivo_backup>"
  exit 1
fi

BACKUP_FILE=$1
DB_FILE="./prisma/dev.db"

# Fazer backup do banco atual
cp $DB_FILE "${DB_FILE}.bak"

# Restaurar backup
cp $BACKUP_FILE $DB_FILE

echo "Banco restaurado de: $BACKUP_FILE"
echo "Backup anterior salvo em: ${DB_FILE}.bak"
```

## 🚀 Deploy em Produção

### Configuração do Servidor

```bash
# Instalar PM2 para gerenciamento de processos
npm install -g pm2

# Configuração PM2
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'mrp2-backend',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3006
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Build para Produção

```bash
# Frontend
npm run build
npm run preview  # Testar build

# Backend
cd backend
npm run build
npm start  # Testar build

# Deploy com PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/mrp2
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /var/www/mrp2/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Uploads
    location /uploads {
        proxy_pass http://localhost:3006;
    }
}
```

## 🔧 Manutenção do Sistema

### Limpeza de Logs

```bash
#!/bin/bash
# cleanup.sh

# Limpar logs antigos (mais de 30 dias)
find ./logs -name "*.log" -type f -mtime +30 -delete

# Limpar uploads temporários
find ./uploads -name "temp_*" -type f -mtime +1 -delete

# Limpar cache do npm
npm cache clean --force

echo "Limpeza concluída"
```

### Atualização de Dependências

```bash
# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências menores
npm update

# Atualizar dependências principais (cuidado!)
npm install react@latest react-dom@latest
npm install @mui/material@latest

# Verificar vulnerabilidades
npm audit
npm audit fix
```

### Monitoramento de Recursos

```typescript
// monitor.ts
setInterval(() => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  console.log({
    timestamp: new Date().toISOString(),
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB'
    },
    uptime: Math.round(process.uptime()) + 's'
  });
}, 60000); // A cada minuto
```

## 🌐 APIs Externas

### Integração com Email

```typescript
// emailService.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendMaintenanceAlert = async (request: MaintenanceRequest) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: 'manutencao@mrp2cpu.com.br',
    subject: `Nova Solicitação de Manutenção - ${request.title}`,
    html: `
      <h2>Nova Solicitação de Manutenção</h2>
      <p><strong>Título:</strong> ${request.title}</p>
      <p><strong>Departamento:</strong> ${request.department}</p>
      <p><strong>Prioridade:</strong> ${request.priority}</p>
      <p><strong>Descrição:</strong> ${request.description}</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};
```

### Webhook para Notificações

```typescript
// webhook.ts
export const sendWebhook = async (event: string, data: any) => {
  const webhookUrl = process.env.WEBHOOK_URL;
  
  if (!webhookUrl) return;
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
  }
};
```

## 🐛 Logs e Debugging

### Sistema de Logs Avançado

```typescript
// logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mrp2-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

### Debug de Requisições

```typescript
// debug.ts
export const debugRequest = (req: Request) => {
  console.log('🔍 DEBUG REQUEST:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params,
    user: req.user,
    timestamp: new Date().toISOString()
  });
};
```

### Ferramentas de Debug

```bash
# Debug do Node.js
node --inspect dist/server.js

# Debug com VS Code
# launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/backend/src/server.ts",
  "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
  "runtimeArgs": ["-r", "ts-node/register"]
}
```

## 📱 Comandos Úteis

### Scripts de Desenvolvimento

```bash
# Reiniciar tudo
npm run restart:all

# Verificar saúde do sistema
npm run health:check

# Limpar e reinstalar
npm run clean:install

# Executar testes
npm run test:all

# Gerar relatório de cobertura
npm run test:coverage

# Verificar tipos TypeScript
npm run type:check

# Formatar código
npm run format

# Lint código
npm run lint:fix
```

### Comandos de Banco de Dados

```bash
# Resetar banco completamente
npm run db:reset

# Fazer seed com dados de teste
npm run db:seed:test

# Exportar dados
npm run db:export

# Importar dados
npm run db:import <file>

# Verificar integridade
npm run db:check
```

---

**Guia Técnico MRP2** - Documentação completa para manutenção e troubleshooting do sistema industrial de manufatura de CPUs. 