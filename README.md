# 🏭 MRP2 - Sistema de Gestão de Produção

## 📋 **VISÃO GERAL**
Sistema MRP (Material Requirements Planning) para gestão completa de produção industrial, com funcionalidades de:
- 👥 **Gestão de Usuários** (Admin, Funcionários, Manutenção)
- 🏭 **Controle de Produção** 
- 🔧 **Gestão de Manutenção**
- 💰 **Controle Financeiro**
- 📊 **Relatórios e Dashboards**

## 🗂️ **ESTRUTURA DO PROJETO**

```
MRP2-front/
├── 📁 backend/                    # Servidor Node.js + Express + Prisma
│   ├── 📁 src/                   # Código fonte do backend
│   │   ├── 📁 routes/           # Rotas da API (auth, users, maintenance)
│   │   ├── 📁 services/         # Lógica de negócio
│   │   ├── 📁 middleware/       # Middlewares (auth, cors, etc)
│   │   └── 📄 server.ts         # Servidor principal
│   ├── 📁 prisma/               # Configuração do banco de dados
│   │   ├── 📄 schema.prisma     # Schema do banco SQLite
│   │   ├── 📄 seed.ts           # Dados iniciais (usuários padrão)
│   │   └── 📁 migrations/       # Histórico de mudanças no DB
│   ├── 📄 package.json          # Dependências do backend
│   └── 📄 dataBase.env          # Configurações do banco
│
├── 📁 src/                       # Frontend React + TypeScript
│   ├── 📁 components/           # Componentes React reutilizáveis
│   │   ├── 📁 Layout/          # Layout principal do sistema
│   │   ├── 📁 Header/          # Cabeçalho com navegação
│   │   └── 📁 EnhancedNavigation/ # Navegação avançada
│   ├── 📁 pages/                # Páginas do sistema
│   │   ├── 📁 Login/           # Página de login
│   │   ├── 📁 AdminHome/       # Dashboard do administrador
│   │   ├── 📁 EmployeeHome/    # Dashboard do funcionário
│   │   ├── 📁 MaintenanceHome/ # Dashboard da manutenção
│   │   ├── 📁 Financial/       # Gestão financeira
│   │   ├── 📁 Settings/        # Configurações do sistema
│   │   └── ...                 # Outras páginas
│   ├── 📁 contexts/             # Contexts React (Estado global)
│   │   ├── 📄 AuthContext.tsx  # Autenticação e autorização
│   │   └── 📄 TimerContext.tsx # Controle de tempo/timers
│   ├── 📁 services/             # Comunicação com APIs
│   │   ├── 📄 authService.ts   # Serviços de autenticação
│   │   ├── 📄 api.ts           # Configuração base do Axios
│   │   └── 📄 maintenanceService.ts # Serviços de manutenção
│   ├── 📁 types/                # Definições TypeScript
│   ├── 📁 hooks/                # Hooks personalizados
│   ├── 📄 App.tsx              # Componente principal + Rotas
│   ├── 📄 main.tsx             # Ponto de entrada da aplicação
│   └── 📄 theme.ts             # Tema Material-UI personalizado
│
├── 📄 package.json              # Dependências do frontend
├── 📄 vite.config.js           # Configuração do Vite (build + proxy)
├── 📄 tsconfig.json            # Configuração TypeScript
├── 📄 index.html               # HTML principal
└── 📄 README.md                # Este arquivo
```

## 🚀 **CONFIGURAÇÃO E INSTALAÇÃO**

### **Pré-requisitos:**
- Node.js 18+ 
- npm ou yarn

### **1. Backend (Servidor API):**
```bash
cd backend
npm install                     # Instalar dependências
npx prisma migrate dev         # Aplicar migrations do banco
npx prisma db seed            # Criar usuários padrão
npm run dev                   # Iniciar servidor (porta 3006)
```

### **2. Frontend (Interface):**
```bash
npm install --legacy-peer-deps  # Instalar dependências (resolver conflitos)
npm run dev                     # Iniciar aplicação (porta 3000)
```

## 🔐 **USUÁRIOS PADRÃO DO SISTEMA**

| Função | Email | Senha | Acesso |
|--------|-------|-------|---------|
| **👨‍💼 Administrador** | `admin@example.com` | `admin123` | Dashboard completa, todas funcionalidades |
| **🔧 Manutenção** | `manutencao@example.com` | `manutencao123` | Gestão de manutenção, ordens de serviço |
| **👷 Funcionário** | `funcionario@example.com` | `funcionario123` | Registro de qualidade, pedidos de manutenção |

## 🌐 **ARQUITETURA TÉCNICA**

### **Frontend:**
- ⚛️ **React 18** + TypeScript
- 🎨 **Material-UI** (componentes e tema)
- 🛣️ **React Router** (roteamento com proteção)
- 📡 **Axios** (comunicação HTTP)
- ⚡ **Vite** (build tool + proxy para API)

### **Backend:**
- 🟢 **Node.js** + Express.js
- 🗄️ **Prisma ORM** + SQLite
- 🔒 **JWT** (autenticação)
- 🔐 **bcrypt** (hash de senhas)
- 🌐 **CORS** habilitado

### **Comunicação:**
- **Frontend (3000)** → **Proxy Vite** → **Backend API (3006)**
- **Autenticação:** JWT tokens no localStorage
- **Autorização:** Middleware no backend + Context no frontend

## 🔧 **PRINCIPAIS FUNCIONALIDADES**

### **👥 Gestão de Usuários:**
- Sistema de login com 3 níveis de acesso
- Autenticação JWT com refresh automático
- Controle de rotas baseado em permissões

### **🏭 Produção:**
- Dashboard de indicadores em tempo real
- Controle de ordens de produção
- Gestão de equipes e turnos

### **🔧 Manutenção:**
- Solicitações de manutenção
- Acompanhamento de status
- Histórico de intervenções

### **💰 Financeiro:**
- Controle de custos operacionais
- Relatórios de receita e despesas
- Indicadores de performance

## 🐛 **SOLUÇÃO DE PROBLEMAS**

### **Backend não inicia:**
```bash
# Verificar se a porta 3006 está livre
netstat -ano | findstr :3006

# Forçar restart do backend
cd backend
taskkill /F /IM node.exe
npm run dev
```

### **Erro de autenticação:**
```bash
# Resetar banco e recriar usuários
cd backend
npx prisma migrate reset --force
npx prisma db seed
```

### **Problemas de dependências:**
```bash
# Frontend
npm install --legacy-peer-deps

# Backend  
cd backend
npm install
```

## 📝 **DESENVOLVIMENTO**

### **Adicionar nova página:**
1. Criar componente em `src/pages/NomePage/`
2. Adicionar rota em `src/App.tsx`
3. Configurar proteção de acesso se necessário

### **Adicionar nova API:**
1. Criar rota em `backend/src/routes/`
2. Implementar service em `backend/src/services/`
3. Criar service no frontend em `src/services/`

### **Modificar banco de dados:**
1. Alterar `backend/prisma/schema.prisma`
2. Executar `npx prisma migrate dev`
3. Atualizar seed se necessário

## 🔄 **STATUS DO PROJETO**
- ✅ Sistema de autenticação funcional
- ✅ Backend API configurado
- ✅ Frontend com roteamento protegido
- ✅ Banco de dados com usuários padrão
- ✅ Proxy Vite configurado
- 🔄 Em desenvolvimento: Funcionalidades específicas de cada módulo

---
**Desenvolvido com ❤️ para gestão industrial eficiente**
