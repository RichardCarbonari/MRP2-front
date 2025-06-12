# 🎨 Frontend - MRP2 Sistema de Manufatura

Documentação completa do frontend do sistema MRP2, desenvolvido com React + TypeScript + Material-UI.

## 📋 Índice

- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Componentes](#componentes)
- [Páginas](#páginas)
- [Serviços](#serviços)
- [Autenticação](#autenticação)
- [Roteamento](#roteamento)
- [Estilos e Temas](#estilos-e-temas)
- [Estado Global](#estado-global)

## 🏗️ Arquitetura

O frontend segue uma arquitetura baseada em componentes com separação clara de responsabilidades:

```
Frontend Architecture
├── Components (Reutilizáveis)
├── Pages (Páginas específicas)
├── Services (Comunicação com API)
├── Contexts (Estado global)
├── Types (Tipagem TypeScript)
└── Utils (Funções utilitárias)
```

### Tecnologias Principais

- **React 18**: Framework principal
- **TypeScript**: Tipagem estática
- **Material-UI v5**: Biblioteca de componentes
- **React Router v6**: Roteamento
- **Axios**: Cliente HTTP
- **Vite**: Build tool e dev server

## 📁 Estrutura de Pastas

```
src/
├── components/              # Componentes reutilizáveis
│   ├── Layout/             # Layout principal
│   ├── Sidebar/            # Barra lateral
│   ├── Header/             # Cabeçalho
│   ├── Breadcrumb/         # Navegação breadcrumb
│   ├── LoadingSpinner/     # Indicador de carregamento
│   └── ProtectedRoute/     # Rota protegida
├── pages/                  # Páginas da aplicação
│   ├── Login/              # Página de login
│   ├── Dashboard/          # Dashboard principal
│   ├── Maintenance/        # Módulo de manutenção
│   ├── Financial/          # Módulo financeiro
│   ├── Orders/             # Módulo de pedidos
│   ├── Quality/            # Módulo de qualidade
│   ├── Inventory/          # Módulo de inventário
│   ├── Planning/           # Módulo de planejamento
│   └── AdminHome/          # Home do administrador
├── services/               # Serviços e APIs
│   ├── api.ts              # Cliente Axios configurado
│   ├── authService.ts      # Serviços de autenticação
│   └── maintenanceService.ts # Serviços de manutenção
├── contexts/               # Contextos React
│   └── AuthContext.tsx     # Contexto de autenticação
├── types/                  # Tipos TypeScript
│   └── index.ts            # Tipos globais
└── utils/                  # Funções utilitárias
    └── constants.ts        # Constantes da aplicação
```

## 🧩 Componentes

### Layout Principal (`src/components/Layout/`)

Componente que envolve toda a aplicação, fornecendo estrutura consistente:

```typescript
interface LayoutProps {
  children: React.ReactNode;
}

// Funcionalidades:
- Sidebar responsiva
- Header com informações do usuário
- Breadcrumb navigation
- Tema Material-UI
```

### Sidebar (`src/components/Sidebar/`)

Navegação lateral com menu baseado no papel do usuário:

```typescript
// Menus por tipo de usuário:
- Admin: Acesso completo a todos os módulos
- Employee: Acesso aos módulos do departamento
- Maintenance: Acesso ao módulo de manutenção
```

### ProtectedRoute (`src/components/ProtectedRoute/`)

Componente para proteger rotas que requerem autenticação:

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employee' | 'maintenance';
}
```

## 📄 Páginas

### 🔐 Login (`src/pages/Login/`)

**Funcionalidades:**
- Autenticação com email/senha
- Validação de formulário
- Redirecionamento baseado no papel
- Tratamento de erros

**Componentes:**
- Formulário de login
- Validação em tempo real
- Feedback visual de carregamento

### 📊 Dashboard (`src/pages/Dashboard/`)

**Funcionalidades:**
- Visão geral da produção
- Métricas em tempo real
- Gráficos e indicadores
- Cards informativos

**Componentes:**
- MetricCard: Exibe métricas individuais
- ProductionChart: Gráfico de produção
- AlertsPanel: Painel de alertas

### 🔧 Manutenção (`src/pages/Maintenance/`)

**Funcionalidades:**
- Criar solicitações de manutenção
- Visualizar histórico
- Gerenciar equipamentos (admin/manutenção)
- Upload de imagens

**Componentes:**
- RequestForm: Formulário de solicitação
- RequestList: Lista de solicitações
- EquipmentManager: Gerenciamento de equipamentos
- ImageUpload: Upload de imagens

### 💰 Financeiro (`src/pages/Financial/`)

**Funcionalidades:**
- Análise de vendas de CPUs
- Métricas financeiras
- Relatórios de custos
- Gráficos de performance

**Componentes:**
- FinancialMetrics: Métricas principais
- SalesTable: Tabela de vendas
- CostAnalysis: Análise de custos

### 📦 Pedidos (`src/pages/Orders/`)

**Funcionalidades:**
- Gerenciar pedidos de CPUs
- Criar novos pedidos
- Acompanhar status
- Estatísticas de pedidos

**Componentes:**
- OrderForm: Formulário de pedido
- OrderList: Lista de pedidos
- OrderStats: Estatísticas
- StatusTracker: Rastreamento de status

### ✅ Qualidade (`src/pages/Quality/`)

**Funcionalidades:**
- Relatórios de qualidade
- Métricas de controle
- Análise de defeitos
- Certificações

**Componentes:**
- QualityReports: Relatórios
- MetricsPanel: Painel de métricas
- DefectAnalysis: Análise de defeitos

### 📋 Inventário (`src/pages/Inventory/`)

**Funcionalidades:**
- Controle de estoque
- Gerenciar ferramentas
- Alertas de baixo estoque
- Movimentações

**Componentes:**
- InventoryTable: Tabela de itens
- ToolsManager: Gerenciador de ferramentas
- StockAlerts: Alertas de estoque

### 📅 Planejamento (`src/pages/Planning/`)

**Funcionalidades:**
- Planejamento de produção
- Cronogramas
- Alocação de recursos
- Previsões

**Componentes:**
- ProductionSchedule: Cronograma
- ResourceAllocation: Alocação de recursos
- ForecastPanel: Painel de previsões

## 🌐 Serviços

### API Client (`src/services/api.ts`)

Cliente Axios configurado com interceptors:

```typescript
// Configurações:
- baseURL: 'http://localhost:3006/api'
- timeout: 10000ms
- Content-Type: application/json

// Interceptors:
- Request: Adiciona token JWT automaticamente
- Response: Trata erros 401 (redirect para login)
```

### Auth Service (`src/services/authService.ts`)

Serviços de autenticação:

```typescript
interface AuthService {
  login(email: string, password: string): Promise<LoginResponse>
  logout(): void
  getCurrentUser(): User | null
  isAuthenticated(): boolean
}
```

### Maintenance Service (`src/services/maintenanceService.ts`)

Serviços específicos de manutenção:

```typescript
interface MaintenanceService {
  getRequests(): Promise<MaintenanceRequest[]>
  createRequest(data: CreateRequestData): Promise<MaintenanceRequest>
  updateRequest(id: string, data: UpdateRequestData): Promise<MaintenanceRequest>
  getEquipment(): Promise<Equipment[]>
}
```

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Login**: Usuário insere credenciais
2. **Validação**: Backend valida e retorna JWT
3. **Armazenamento**: Token salvo no localStorage
4. **Interceptor**: Token adicionado automaticamente às requisições
5. **Proteção**: Rotas protegidas verificam autenticação

### Context de Autenticação

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

### Tipos de Usuário

```typescript
type UserRole = 'admin' | 'employee' | 'maintenance';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}
```

## 🛣️ Roteamento

### Estrutura de Rotas

```typescript
// Rotas públicas
/login - Página de login

// Rotas protegidas
/ - Dashboard (redirecionamento baseado no papel)
/dashboard - Dashboard principal
/maintenance - Módulo de manutenção
/financial - Módulo financeiro (admin only)
/orders - Módulo de pedidos
/quality - Módulo de qualidade
/inventory - Módulo de inventário
/planning - Módulo de planejamento
/admin - Área administrativa (admin only)
```

### Proteção de Rotas

```typescript
// Exemplo de rota protegida
<ProtectedRoute requiredRole="admin">
  <FinancialPage />
</ProtectedRoute>
```

## 🎨 Estilos e Temas

### Material-UI Theme

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Verde industrial
    },
    secondary: {
      main: '#1976d2', // Azul
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});
```

### Componentes Estilizados

- Cards com sombras e hover effects
- Tabelas responsivas
- Formulários com validação visual
- Indicadores de loading
- Animações suaves (Fade, Zoom)

## 🔄 Estado Global

### Context API

O estado global é gerenciado através do Context API do React:

```typescript
// AuthContext: Estado de autenticação
- user: Usuário atual
- isAuthenticated: Status de autenticação
- login/logout: Funções de autenticação
```

### Local State

Cada página gerencia seu próprio estado local:

```typescript
// Exemplo: Página de Manutenção
const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## 📱 Responsividade

### Breakpoints Material-UI

```typescript
// xs: 0px
// sm: 600px
// md: 900px
// lg: 1200px
// xl: 1536px
```

### Componentes Responsivos

- Grid system para layouts
- Sidebar colapsável em mobile
- Tabelas com scroll horizontal
- Cards que se adaptam ao tamanho da tela

## 🔍 Debugging e Logs

### Console Logs

```typescript
// Logs estruturados para debugging
console.log('🔐 Login attempt:', { email, timestamp });
console.error('❌ API Error:', error);
console.info('✅ Request successful:', data);
```

### Error Boundaries

Componentes para capturar erros em tempo de execução e exibir fallbacks apropriados.

## 🚀 Performance

### Otimizações Implementadas

- **Lazy Loading**: Carregamento sob demanda de páginas
- **Memoization**: React.memo para componentes pesados
- **Code Splitting**: Divisão do bundle por rotas
- **Image Optimization**: Compressão de imagens
- **API Caching**: Cache de requisições frequentes

### Bundle Analysis

```bash
npm run build
npm run preview
```

## 🧪 Testes

### Estrutura de Testes

```typescript
// Testes unitários para componentes
// Testes de integração para fluxos
// Testes E2E para cenários críticos
```

### Ferramentas Sugeridas

- **Jest**: Framework de testes
- **React Testing Library**: Testes de componentes
- **Cypress**: Testes E2E

## 📦 Build e Deploy

### Scripts de Build

```bash
npm run build    # Build para produção
npm run preview  # Preview do build
npm run dev      # Desenvolvimento
```

### Configuração Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

---

**Frontend MRP2** - Interface moderna e responsiva para sistema industrial de manufatura de CPUs. 