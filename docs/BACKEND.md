# ⚙️ Backend - MRP2 Sistema de Manufatura

Documentação completa do backend do sistema MRP2, desenvolvido com Node.js + TypeScript + Express + Prisma.

## 📋 Índice

- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Banco de Dados](#banco-de-dados)
- [Autenticação](#autenticação)
- [Rotas e Endpoints](#rotas-e-endpoints)
- [Middlewares](#middlewares)
- [Serviços](#serviços)
- [Validação](#validação)
- [Upload de Arquivos](#upload-de-arquivos)
- [Logs e Monitoramento](#logs-e-monitoramento)

## 🏗️ Arquitetura

O backend segue uma arquitetura em camadas com separação clara de responsabilidades:

```
Backend Architecture
├── Routes (Endpoints da API)
├── Middleware (Autenticação, Validação, CORS)
├── Services (Lógica de negócio)
├── Database (Prisma ORM + SQLite)
├── Types (Tipagem TypeScript)
└── Utils (Funções utilitárias)
```

### Tecnologias Principais

- **Node.js 18+**: Runtime JavaScript
- **TypeScript**: Tipagem estática
- **Express.js**: Framework web
- **Prisma**: ORM para banco de dados
- **SQLite**: Banco de dados
- **JWT**: Autenticação
- **bcrypt**: Criptografia de senhas
- **multer**: Upload de arquivos

## 📁 Estrutura de Pastas

```
backend/
├── src/
│   ├── routes/              # Rotas da API
│   │   ├── auth.ts          # Autenticação
│   │   ├── maintenance.ts   # Manutenção
│   │   ├── financial.ts     # Financeiro
│   │   ├── orders.ts        # Pedidos
│   │   ├── quality.ts       # Qualidade
│   │   ├── inventory.ts     # Inventário
│   │   └── employees.ts     # Funcionários
│   ├── middleware/          # Middlewares
│   │   ├── auth.ts          # Middleware de autenticação
│   │   ├── cors.ts          # Configuração CORS
│   │   └── validation.ts    # Validação de dados
│   ├── services/            # Lógica de negócio
│   │   ├── authService.ts   # Serviços de autenticação
│   │   ├── emailService.ts  # Serviços de email
│   │   └── fileService.ts   # Serviços de arquivo
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts         # Tipos globais
│   ├── utils/               # Funções utilitárias
│   │   ├── constants.ts     # Constantes
│   │   └── helpers.ts       # Funções auxiliares
│   └── server.ts            # Servidor principal
├── prisma/                  # Configuração Prisma
│   ├── schema.prisma        # Schema do banco
│   ├── seed.ts              # Dados iniciais
│   └── migrations/          # Migrações
├── uploads/                 # Arquivos enviados
└── package.json             # Dependências
```

## 🗄️ Banco de Dados

### Schema Prisma

O banco de dados utiliza SQLite com Prisma ORM:

```prisma
// Usuários do sistema
model User {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  password    String
  role        String   // 'admin', 'employee', 'maintenance'
  department  String?  // Departamento específico
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relacionamentos
  maintenanceRequests MaintenanceRequest[]
  orders             Order[]
}

// Solicitações de manutenção
model MaintenanceRequest {
  id          String   @id @default(cuid())
  title       String
  description String
  priority    String   // 'low', 'medium', 'high', 'urgent'
  status      String   // 'pending', 'in_progress', 'completed', 'cancelled'
  department  String
  equipment   String
  requestedBy String
  assignedTo  String?
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relacionamentos
  user        User     @relation(fields: [requestedBy], references: [id])
}

// Equipamentos
model Equipment {
  id           String   @id @default(cuid())
  name         String
  type         String
  department   String
  status       String   // 'operational', 'maintenance', 'broken'
  lastMaintenance DateTime?
  nextMaintenance DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// Pedidos de CPUs
model Order {
  id            String   @id @default(cuid())
  customerName  String
  customerEmail String
  customerPhone String
  cpuType       String
  quantity      Int
  unitPrice     Float
  totalPrice    Float
  status        String   // 'pending', 'assembly', 'testing', 'ready', 'delivered'
  priority      String   // 'high', 'medium', 'low'
  orderDate     DateTime
  deliveryDate  DateTime
  notes         String?
  createdBy     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relacionamentos
  user          User     @relation(fields: [createdBy], references: [id])
}
```

### Comandos Prisma

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar mudanças no banco
npx prisma db push

# Visualizar banco de dados
npx prisma studio

# Executar seed
npm run seed
```

## 🔐 Autenticação

### JWT Token

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  department?: string;
}

// Geração do token
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
```

### Middleware de Autenticação

```typescript
// src/middleware/auth.ts
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
```

### Criptografia de Senhas

```typescript
import bcrypt from 'bcrypt';

// Hash da senha
const hashedPassword = await bcrypt.hash(password, 10);

// Verificação da senha
const isValid = await bcrypt.compare(password, hashedPassword);
```

## 🛣️ Rotas e Endpoints

### Autenticação (`/api/auth`)

```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: User }

POST /api/auth/verify-email
Body: { email: string }
Response: { message: string }

POST /api/auth/reset-password
Body: { email: string, newPassword: string }
Response: { message: string }
```

### Manutenção (`/api/maintenance`)

```typescript
GET /api/maintenance/requests
Headers: Authorization: Bearer <token>
Response: MaintenanceRequest[]

POST /api/maintenance/requests
Headers: Authorization: Bearer <token>
Body: CreateMaintenanceRequestData
Response: MaintenanceRequest

PUT /api/maintenance/requests/:id
Headers: Authorization: Bearer <token>
Body: UpdateMaintenanceRequestData
Response: MaintenanceRequest

GET /api/maintenance/equipment
Headers: Authorization: Bearer <token>
Response: Equipment[]

GET /api/maintenance/records
Headers: Authorization: Bearer <token>
Response: MaintenanceRecord[]

GET /api/maintenance/metrics
Headers: Authorization: Bearer <token>
Response: MaintenanceMetrics
```

### Financeiro (`/api/financial`)

```typescript
GET /api/financial/cpu-sales
Headers: Authorization: Bearer <token>
Response: CPUSalesData[]

GET /api/financial/metrics
Headers: Authorization: Bearer <token>
Response: FinancialMetrics

GET /api/financial/reports
Headers: Authorization: Bearer <token>
Query: { startDate?, endDate?, department? }
Response: FinancialReport[]
```

### Pedidos (`/api/orders`)

```typescript
GET /api/orders
Headers: Authorization: Bearer <token>
Query: { status?, priority?, customer? }
Response: Order[]

POST /api/orders
Headers: Authorization: Bearer <token>
Body: CreateOrderData
Response: Order

PUT /api/orders/:id
Headers: Authorization: Bearer <token>
Body: UpdateOrderData
Response: Order

DELETE /api/orders/:id
Headers: Authorization: Bearer <token>
Response: { message: string }

GET /api/orders/stats/summary
Headers: Authorization: Bearer <token>
Response: OrderStats

GET /api/orders/cpu-types
Headers: Authorization: Bearer <token>
Response: CPUType[]
```

### Qualidade (`/api/orders/quality`)

```typescript
GET /api/orders/quality/reports
Headers: Authorization: Bearer <token>
Response: QualityReport[]

GET /api/orders/quality/metrics
Headers: Authorization: Bearer <token>
Response: QualityMetrics
```

### Funcionários (`/api/employees`)

```typescript
GET /api/employees
Headers: Authorization: Bearer <token>
Response: Employee[]

POST /api/employees
Headers: Authorization: Bearer <token>
Body: CreateEmployeeData
Response: Employee

PUT /api/employees/:id
Headers: Authorization: Bearer <token>
Body: UpdateEmployeeData
Response: Employee

DELETE /api/employees/:id
Headers: Authorization: Bearer <token>
Response: { message: string }
```

## 🛡️ Middlewares

### CORS Middleware

```typescript
// src/middleware/cors.ts
export const corsMiddleware = cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

### Validação Middleware

```typescript
// src/middleware/validation.ts
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};
```

### Logging Middleware

```typescript
// Middleware para logs de requisições
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
};
```

## 🔧 Serviços

### Auth Service

```typescript
// src/services/authService.ts
export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Credenciais inválidas');
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return { token, user: { ...user, password: undefined } };
  }
  
  static async resetPassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
  }
}
```

### Email Service

```typescript
// src/services/emailService.ts
export class EmailService {
  static async sendPasswordReset(email: string, resetToken: string) {
    // Implementação de envio de email
    console.log(`Enviando email de reset para: ${email}`);
    console.log(`Token: ${resetToken}`);
  }
  
  static async sendMaintenanceNotification(request: MaintenanceRequest) {
    // Notificação de nova solicitação de manutenção
    console.log(`Nova solicitação de manutenção: ${request.title}`);
  }
}
```

### File Service

```typescript
// src/services/fileService.ts
export class FileService {
  static async uploadImage(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join('uploads', filename);
    
    await fs.writeFile(filepath, file.buffer);
    
    return `/uploads/${filename}`;
  }
  
  static async deleteImage(imageUrl: string): Promise<void> {
    const filepath = path.join('.', imageUrl);
    await fs.unlink(filepath);
  }
}
```

## ✅ Validação

### Schemas de Validação

```typescript
import Joi from 'joi';

// Validação de login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Validação de solicitação de manutenção
export const maintenanceRequestSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').required(),
  department: Joi.string().required(),
  equipment: Joi.string().required()
});

// Validação de pedido
export const orderSchema = Joi.object({
  customerName: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  customerPhone: Joi.string().required(),
  cpuType: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  deliveryDate: Joi.date().required(),
  priority: Joi.string().valid('high', 'medium', 'low').default('medium'),
  notes: Joi.string().allow('')
});
```

## 📁 Upload de Arquivos

### Configuração Multer

```typescript
import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});
```

### Endpoint de Upload

```typescript
// Upload de imagem para solicitação de manutenção
router.post('/maintenance/requests/:id/image', 
  authMiddleware, 
  upload.single('image'), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: 'Nenhuma imagem fornecida' });
      }
      
      const imageUrl = await FileService.uploadImage(file);
      
      const updatedRequest = await prisma.maintenanceRequest.update({
        where: { id },
        data: { imageUrl }
      });
      
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
  }
);
```

## 📊 Logs e Monitoramento

### Sistema de Logs

```typescript
// Logs estruturados
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`ℹ️ ${new Date().toISOString()} - ${message}`, data || '');
  },
  
  error: (message: string, error?: any) => {
    console.error(`❌ ${new Date().toISOString()} - ${message}`, error || '');
  },
  
  success: (message: string, data?: any) => {
    console.log(`✅ ${new Date().toISOString()} - ${message}`, data || '');
  },
  
  warning: (message: string, data?: any) => {
    console.warn(`⚠️ ${new Date().toISOString()} - ${message}`, data || '');
  }
};
```

### Monitoramento de Performance

```typescript
// Middleware para medir tempo de resposta
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};
```

## 🚀 Inicialização do Servidor

### Servidor Principal

```typescript
// src/server.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3006;

// Middlewares globais
app.use(express.json());
app.use(corsMiddleware);
app.use(loggingMiddleware);
app.use(performanceMiddleware);

// Servir arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/employees', employeesRoutes);

// Middleware de tratamento de erros
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização
app.listen(PORT, () => {
  logger.success(`🚀 Servidor rodando na porta ${PORT}`);
  logger.info(`📊 Prisma Studio: http://localhost:5555`);
  logger.info(`🌐 API Base URL: http://localhost:${PORT}/api`);
});
```

## 🗃️ Dados Iniciais (Seed)

### Script de Seed

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar usuários
  const adminPassword = await bcrypt.hash('admin123', 10);
  const employeePassword = await bcrypt.hash('funcionario123', 10);
  const maintenancePassword = await bcrypt.hash('manutencao123', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Carlos Diretor',
      email: 'carlos.diretor@mrp2cpu.com.br',
      password: adminPassword,
      role: 'admin'
    }
  });
  
  const employee = await prisma.user.create({
    data: {
      name: 'Maria Substrato',
      email: 'maria.substrato@mrp2cpu.com.br',
      password: employeePassword,
      role: 'employee',
      department: 'Montagem Substrato'
    }
  });
  
  const maintenance = await prisma.user.create({
    data: {
      name: 'João Manutenção',
      email: 'joao.manutencao@mrp2cpu.com.br',
      password: maintenancePassword,
      role: 'maintenance'
    }
  });
  
  // Criar equipamentos
  const equipments = [
    { name: 'Máquina de Solda SMD', type: 'Soldagem', department: 'Montagem Substrato' },
    { name: 'Forno de Refusão', type: 'Aquecimento', department: 'Bonding' },
    { name: 'Máquina de Encapsulamento', type: 'Encapsulamento', department: 'Encapsulamento' },
    { name: 'Testador Automático', type: 'Teste', department: 'Testes' },
    { name: 'Seladora de Embalagem', type: 'Embalagem', department: 'Embalagem' }
  ];
  
  for (const equipment of equipments) {
    await prisma.equipment.create({
      data: {
        ...equipment,
        status: 'operational'
      }
    });
  }
  
  console.log('✅ Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 🔧 Scripts NPM

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "seed": "tsx prisma/seed.ts",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

## 🌍 Variáveis de Ambiente

```env
# .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu-jwt-secret-super-seguro"
PORT=3006
NODE_ENV=development
```

## 🔒 Segurança

### Medidas Implementadas

- **JWT Tokens**: Autenticação stateless
- **bcrypt**: Hash seguro de senhas
- **CORS**: Controle de origem das requisições
- **Validação**: Validação rigorosa de entrada
- **Rate Limiting**: Prevenção de ataques de força bruta
- **Sanitização**: Limpeza de dados de entrada

### Headers de Segurança

```typescript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

---

**Backend MRP2** - API robusta e segura para sistema industrial de manufatura de CPUs. 