# 🏭 MRP2 - Sistema de Planejamento de Recursos de Manufatura

## 📋 Visão Geral

O MRP2 é um sistema completo de planejamento de recursos de manufatura desenvolvido com **React + TypeScript** no frontend e **Node.js + Express + Prisma** no backend. O sistema oferece funcionalidades completas para gerenciamento de pedidos, inventário, manutenção, qualidade e análises financeiras.

## ✨ Funcionalidades Principais

### 🛒 **Gestão de Pedidos**
- ✅ **CRUD completo** de pedidos com dados persistentes
- ✅ **Catálogo de produtos** integrado com banco de dados
- ✅ **Cálculos automáticos** de preços, custos e lucros
- ✅ **Status tracking** (Pendente → Processamento → Entregue)
- ✅ **Interface moderna** com especificações técnicas detalhadas

### 🖥️ **Gerenciamento de CPUs**
- ✅ **Catálogo completo** com especificações técnicas
- ✅ **Interface profissional** com ícones e cores
- ✅ **Formulários avançados** para adicionar/editar produtos
- ✅ **Visualização detalhada** de cores, threads, clock, socket, TDP
- ✅ **Gestão de estoque** e status de produtos

### 🔧 **Sistema de Manutenção**
- ✅ **Solicitações de manutenção** com priorização
- ✅ **Atribuição automática** para técnicos
- ✅ **Controle de permissões** (Admin + Técnicos)
- ✅ **Histórico completo** de manutenções

### 📊 **Controle de Qualidade**
- ✅ **Relatórios de qualidade** com categorização
- ✅ **Sistema de aprovação** e resolução
- ✅ **Métricas de qualidade** em tempo real

### 💰 **Análise Financeira**
- ✅ **Dashboard financeiro** com gráficos
- ✅ **Análise de custos** operacionais
- ✅ **Relatórios de receita** e lucro
- ✅ **Comparações mensais** e tendências

### 📦 **Gestão de Inventário**
- ✅ **Controle de estoque** em tempo real
- ✅ **Gestão de ferramentas** e equipamentos
- ✅ **Localização de itens** no almoxarifado

## 🏗️ Arquitetura do Sistema

### **Frontend (React + TypeScript)**
```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas principais
│   ├── Planning/       # 🛒 Gestão de pedidos e CPUs
│   ├── Maintenance/    # 🔧 Sistema de manutenção
│   ├── Quality/        # 📊 Controle de qualidade
│   ├── Financial/      # 💰 Análises financeiras
│   └── Inventory/      # 📦 Gestão de inventário
├── services/           # Integração com APIs
└── utils/              # Utilitários e helpers
```

### **Backend (Node.js + Express + Prisma)**
```
backend/
├── src/
│   ├── routes/         # 🛣️ Rotas da API
│   │   ├── orders.ts   # Gestão de pedidos
│   │   ├── maintenance.ts # Sistema de manutenção
│   │   ├── quality.ts  # Controle de qualidade
│   │   └── financial.ts # Análises financeiras
│   ├── middleware/     # 🔐 Autenticação e validações
│   ├── services/       # 🔧 Lógica de negócio
│   └── utils/          # 📚 Utilitários
├── prisma/
│   ├── schema.prisma   # 🗄️ Modelo do banco de dados
│   └── dev.db          # 💾 Banco SQLite
└── scripts/            # 🌱 Scripts de seed e migração
```

## 🗄️ Banco de Dados

### **Modelos Principais**

#### **👤 User** - Usuários do sistema
- Roles: `admin`, `employee`, `maintenance`
- Autenticação e controle de acesso

#### **🛒 Order** - Pedidos de venda
- Informações do cliente
- Status e datas de entrega
- Cálculos financeiros (receita, custo, lucro)

#### **📦 OrderItem** - Itens dos pedidos
- Produtos específicos
- Quantidades e preços
- Cálculos de lucro por item

#### **🖥️ Product** - Catálogo de produtos
- CPUs, GPUs, RAM, etc.
- Especificações técnicas em JSON
- Controle de estoque e preços

#### **🔧 MaintenanceRequest** - Solicitações de manutenção
- Equipamentos e descrições
- Atribuição para técnicos
- Controle de status e soluções

#### **📊 QualityReport** - Relatórios de qualidade
- Categorização por tipo
- Sistema de resolução
- Métricas de qualidade

## 🚀 Como Executar

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Git

### **1. Clonar o Repositório**
```bash
git clone <repository-url>
cd MRP2-front
```

### **2. Instalar Dependências**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### **3. Configurar Banco de Dados**
```bash
cd backend

# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma db push

# Popular com dados de exemplo
npx ts-node src/seed-users.ts
npx ts-node src/seed-products.ts
npx ts-node src/seed-orders.ts
```

### **4. Executar o Sistema**
```bash
# Backend (Terminal 1)
cd backend
npm run dev
# Servidor: http://localhost:3006

# Frontend (Terminal 2)
npm run dev
# Interface: http://localhost:3000
```

### **5. Acessar o Sistema**
- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:3006
- **Prisma Studio**: `npx prisma studio` (visualizar banco)

## 🔐 Usuários Padrão

### **Admin**
- **Email**: admin@mrp2.com
- **Senha**: admin123
- **Permissões**: Acesso total ao sistema

### **Técnico de Manutenção**
- **Email**: manutencao@mrp2.com
- **Senha**: manutencao123
- **Permissões**: Sistema de manutenção

### **Funcionário**
- **Email**: funcionario@mrp2.com
- **Senha**: funcionario123
- **Permissões**: Operações básicas

## 📊 Dados de Exemplo

O sistema vem pré-populado com:
- **5 CPUs** no catálogo (Intel i9, AMD Ryzen, etc.)
- **6 pedidos** de exemplo com diferentes status
- **Usuários** com diferentes permissões
- **Dados financeiros** para demonstração

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- ⚛️ **React 18** - Framework principal
- 📘 **TypeScript** - Tipagem estática
- 🎨 **Material-UI** - Componentes e design
- 📊 **Recharts** - Gráficos e visualizações
- 🌐 **Axios** - Cliente HTTP
- 📅 **Date-fns** - Manipulação de datas

### **Backend**
- 🟢 **Node.js** - Runtime JavaScript
- 🚀 **Express** - Framework web
- 🗄️ **Prisma** - ORM e gerenciamento de banco
- 💾 **SQLite** - Banco de dados
- 🔐 **JWT** - Autenticação
- 📘 **TypeScript** - Tipagem estática

## 📈 Métricas do Sistema

### **Performance**
- ⚡ **Build otimizado** com Vite
- 🔄 **Lazy loading** de componentes
- 📱 **Responsivo** para mobile e desktop
- 🚀 **API RESTful** com validações

### **Qualidade de Código**
- ✅ **TypeScript** em 100% do código
- 🧪 **Validações** de entrada e saída
- 🔒 **Middleware** de segurança
- 📝 **Documentação** completa

## 🔄 Fluxo de Trabalho

### **1. Gestão de Pedidos**
```
Cliente → Pedido → Validação → Produção → Entrega
```

### **2. Sistema de Manutenção**
```
Solicitação → Atribuição → Execução → Resolução
```

### **3. Controle de Qualidade**
```
Relatório → Análise → Ação Corretiva → Aprovação
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@mrp2.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: https://mrp2.com

---

**Desenvolvido com ❤️ para otimizar processos de manufatura** 