# 🚀 Backend MRP2 - API de Gestão de Manufatura

## 📋 Visão Geral

O backend do MRP2 é uma API RESTful desenvolvida em **Node.js + TypeScript + Express + Prisma** que gerencia todos os aspectos do sistema de manufatura, incluindo pedidos, produtos, manutenção, qualidade e análises financeiras.

## 🏗️ Arquitetura

```
backend/
├── src/
│   ├── routes/              # 🛣️ Definição das rotas da API
│   │   ├── orders.ts        # Gestão de pedidos e produtos
│   │   ├── maintenance.ts   # Sistema de manutenção
│   │   ├── quality.ts       # Controle de qualidade
│   │   ├── financial.ts     # Análises financeiras
│   │   └── auth.ts          # Autenticação e autorização
│   ├── middleware/          # 🔐 Middlewares de segurança
│   │   ├── auth.ts          # Verificação de JWT
│   │   └── validation.ts    # Validação de dados
│   ├── services/            # 🔧 Lógica de negócio
│   │   ├── orderService.ts  # Serviços de pedidos
│   │   └── userService.ts   # Serviços de usuários
│   ├── utils/               # 📚 Utilitários
│   └── server.ts            # 🌐 Configuração do servidor
├── prisma/
│   ├── schema.prisma        # 🗄️ Modelo do banco de dados
│   ├── dev.db               # 💾 Banco SQLite
│   └── migrations/          # 📈 Histórico de migrações
└── scripts/                 # 🌱 Scripts de inicialização
    ├── seed-users.ts        # Popular usuários
    ├── seed-products.ts     # Popular produtos
    └── seed-orders.ts       # Popular pedidos
```

## 🗄️ Banco de Dados

### **Tecnologia**: SQLite + Prisma ORM

### **Modelos Principais**:

#### 👤 **User** - Usuários do Sistema
```typescript
{
  id: string          // UUID único
  email: string       // Email para login
  password: string    // Senha criptografada
  name: string        // Nome completo
  role: string        // 'admin' | 'employee' | 'maintenance'
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 🛒 **Order** - Pedidos de Venda
```typescript
{
  id: string           // UUID único
  orderNumber: string  // Número sequencial (ORD-2024-001)
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string       // 'pending' | 'processing' | 'delivered'
  totalAmount: number  // Valor total de venda
  totalCost: number    // Custo total dos produtos
  profitAmount: number // Lucro (totalAmount - totalCost)
  createdBy: string    // ID do usuário criador
  deliveredAt: DateTime
}
```

#### 📦 **OrderItem** - Itens dos Pedidos
```typescript
{
  id: string
  orderId: string      // Referência ao pedido
  productId: string    // Referência ao produto
  quantity: number
  unitPrice: number    // Preço de venda unitário
  unitCost: number     // Custo unitário
  subtotal: number     // Total do item
  profit: number       // Lucro do item
}
```

#### 🖥️ **Product** - Catálogo de Produtos
```typescript
{
  id: string
  name: string         // Nome comercial
  category: string     // 'CPU' | 'GPU' | 'RAM'
  brand: string        // Intel, AMD, NVIDIA
  price: number        // Preço de venda
  cost: number         // Custo de aquisição
  specifications: JSON // Specs técnicas flexíveis
  stock: number        // Quantidade em estoque
  isActive: boolean    // Produto ativo/inativo
}
```

## 🛣️ Rotas da API

### **Base URL**: `http://localhost:3006/api`

### 🛒 **Pedidos** (`/orders`)

#### **GET /orders**
- **Descrição**: Lista todos os pedidos
- **Resposta**: Array de pedidos com produtos incluídos
- **Exemplo**:
```json
[
  {
    "id": "ORD-2024-001",
    "customerName": "João Silva",
    "cpuType": "uuid-cpu-123",
    "quantity": 2,
    "totalPrice": 6000.00,
    "status": "pending"
  }
]
```

#### **POST /orders**
- **Descrição**: Cria novo pedido
- **Body**:
```json
{
  "customerName": "Maria Santos",
  "customerEmail": "maria@email.com",
  "customerPhone": "(11) 99999-9999",
  "cpuType": "uuid-cpu-123",
  "quantity": 1,
  "deliveryDate": "2024-02-20"
}
```
- **Validações**:
  - ✅ Campos obrigatórios
  - ✅ Produto existe no catálogo
  - ✅ Quantidade > 0
  - ✅ Data de entrega futura
  - ✅ Cálculos automáticos de preço/lucro

#### **PUT /orders/:id**
- **Descrição**: Atualiza pedido existente
- **Params**: `id` - Número do pedido
- **Body**: Campos a serem atualizados
- **Funcionalidades**:
  - 🔄 Recalcula valores automaticamente
  - 📝 Atualiza dados do cliente
  - 🔄 Muda status do pedido

#### **DELETE /orders/:id**
- **Descrição**: Remove pedido permanentemente
- **Params**: `id` - Número do pedido
- **Resposta**: Status 204 (No Content)

### 🖥️ **Produtos** (`/orders/cpu-types`)

#### **GET /orders/cpu-types**
- **Descrição**: Lista CPUs disponíveis no catálogo
- **Filtros**: Apenas produtos ativos da categoria 'CPU'
- **Resposta**:
```json
{
  "uuid-123": {
    "name": "Intel Core i9-13900K",
    "price": 3000.00,
    "specs": {
      "cores": 24,
      "threads": 32,
      "baseClock": "3.0 GHz",
      "socket": "LGA1700"
    }
  }
}
```

### 📊 **Estatísticas** (`/orders/stats/summary`)

#### **GET /orders/stats/summary**
- **Descrição**: Métricas resumidas do sistema
- **Resposta**:
```json
{
  "summary": {
    "totalOrders": 6,
    "pendingOrders": 2,
    "inProgressOrders": 2,
    "completedOrders": 2,
    "totalRevenue": 28300.00,
    "averageOrderValue": 4716.67
  }
}
```

## 🔐 Autenticação

### **Sistema JWT**
- **Login**: `POST /api/auth/login`
- **Token**: Enviado no header `Authorization: Bearer <token>`
- **Middleware**: Verificação automática em rotas protegidas

### **Níveis de Acesso**:
- **Admin**: Acesso total ao sistema
- **Employee**: Operações básicas
- **Maintenance**: Sistema de manutenção

## 💾 Scripts de Inicialização

### **Configurar Banco**
```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar schema ao banco
npx prisma db push

# Visualizar dados
npx prisma studio
```

### **Popular com Dados**
```bash
# Usuários padrão
npx ts-node src/seed-users.ts

# Catálogo de produtos
npx ts-node src/seed-products.ts

# Pedidos de exemplo
npx ts-node src/seed-orders.ts
```

## 🔧 Desenvolvimento

### **Executar Servidor**
```bash
# Modo desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Executar build
npm start
```

### **Logs do Sistema**
O servidor registra automaticamente:
- ✅ **Operações CRUD** com detalhes
- 🔍 **Consultas ao banco** com performance
- ❌ **Erros** com stack trace completo
- 🔐 **Tentativas de autenticação**

### **Exemplo de Log**:
```
🔍 Buscando tipos de CPU disponíveis...
✅ Encontrados 5 tipos de CPU
➕ Criando novo pedido...
💰 Cálculos: Receita R$ 6000, Custo R$ 4000, Lucro R$ 2000
✅ Pedido criado: ORD-2024-007 - João Silva - R$ 6000
```

## 🧪 Validações e Segurança

### **Validações de Entrada**
- ✅ **Campos obrigatórios** verificados
- ✅ **Tipos de dados** validados
- ✅ **Regras de negócio** aplicadas
- ✅ **Sanitização** de inputs

### **Segurança**
- 🔐 **JWT** para autenticação
- 🛡️ **CORS** configurado
- 🔒 **Senhas** criptografadas com bcrypt
- 🚫 **SQL Injection** prevenido pelo Prisma

## 📈 Performance

### **Otimizações**
- ⚡ **Queries otimizadas** com includes específicos
- 🔄 **Conexão persistente** com banco
- 📊 **Agregações** eficientes para estatísticas
- 🗂️ **Índices** automáticos do Prisma

### **Monitoramento**
- 📊 **Logs de performance** para queries lentas
- 🔍 **Rastreamento** de operações críticas
- 📈 **Métricas** de uso da API

## 🚀 Deploy

### **Variáveis de Ambiente**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu-jwt-secret-aqui"
PORT=3006
NODE_ENV=production
```

### **Build de Produção**
```bash
# Compilar TypeScript
npm run build

# Executar migrações
npx prisma migrate deploy

# Iniciar servidor
npm start
```

## 🤝 Contribuição

### **Padrões de Código**
- 📝 **Comentários** detalhados em todas as funções
- 🏷️ **TypeScript** obrigatório
- 🧪 **Validações** em todas as entradas
- 📊 **Logs** informativos com emojis

### **Estrutura de Commits**
```
feat: ✨ nova funcionalidade
fix: 🐛 correção de bug
docs: 📝 atualização de documentação
refactor: ♻️ refatoração de código
```

---

**Desenvolvido com ❤️ para otimizar processos de manufatura** 