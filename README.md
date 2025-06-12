# MRP2 - Sistema de Manufatura de CPUs

Sistema completo de MRP (Material Requirements Planning) para manufatura de CPUs, desenvolvido com React + TypeScript no frontend e Node.js + TypeScript + Prisma no backend.

## 🏭 Sobre o Sistema

O MRP2 é um sistema industrial completo para gerenciamento de manufatura de CPUs, cobrindo todos os departamentos da linha de produção:

- **Montagem Substrato** - Preparação da base dos processadores
- **Bonding** - Conexão dos componentes eletrônicos
- **Encapsulamento** - Proteção e acabamento dos chips
- **Testes** - Controle de qualidade e validação
- **Embalagem** - Preparação para distribuição

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Material-UI (MUI)** para interface
- **Vite** como bundler
- **React Router** para navegação
- **Axios** para requisições HTTP
- **JWT** para autenticação

### Backend
- **Node.js** com TypeScript
- **Express.js** como framework web
- **Prisma** como ORM
- **SQLite** como banco de dados
- **JWT** para autenticação
- **bcrypt** para criptografia de senhas

## 📋 Funcionalidades Principais

### 👤 Sistema de Usuários
- **Administradores**: Acesso completo ao sistema
- **Funcionários**: Acesso aos departamentos específicos
- **Manutenção**: Gerenciamento de equipamentos e solicitações

### 🔧 Módulos do Sistema
- **Dashboard**: Visão geral da produção
- **Manutenção**: Solicitações e gerenciamento de equipamentos
- **Qualidade**: Controle e relatórios de qualidade
- **Financeiro**: Análise de vendas e custos
- **Pedidos**: Gerenciamento de pedidos de CPUs
- **Inventário**: Controle de estoque e ferramentas
- **Planejamento**: Planejamento de produção

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd MRP2-front
```

### 2. Instale as dependências do Frontend
```bash
npm install --legacy-peer-deps
```

### 3. Configure o Backend
```bash
cd backend
npm install
```

### 4. Configure o banco de dados
```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
```

### 5. Inicie os serviços

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
*Servidor rodará na porta 3006*

**Frontend (Terminal 2):**
```bash
npm run dev
```
*Interface rodará na porta 3000*

## 🔐 Credenciais de Acesso

### Administrador
- **Email**: carlos.diretor@mrp2cpu.com.br
- **Senha**: admin123

### Manutenção
- **Email**: joao.manutencao@mrp2cpu.com.br
- **Senha**: manutencao123

### Funcionários
- **Email**: maria.substrato@mrp2cpu.com.br
- **Senha**: funcionario123

## 📁 Estrutura do Projeto

```
MRP2-front/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── services/           # Serviços e APIs
│   ├── contexts/           # Contextos React
│   └── types/              # Tipos TypeScript
├── backend/
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── services/       # Lógica de negócio
│   │   └── types/          # Tipos TypeScript
│   ├── prisma/             # Schema e migrações
│   └── uploads/            # Arquivos enviados
└── docs/                   # Documentação
```

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/verify-email` - Verificação de email
- `POST /api/auth/reset-password` - Reset de senha

### Manutenção
- `GET /api/maintenance/requests` - Listar solicitações
- `POST /api/maintenance/requests` - Criar solicitação
- `PUT /api/maintenance/requests/:id` - Atualizar solicitação
- `GET /api/maintenance/equipment` - Listar equipamentos

### Financeiro
- `GET /api/financial/cpu-sales` - Dados de vendas de CPUs

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/stats/summary` - Estatísticas

### Qualidade
- `GET /api/orders/quality/reports` - Relatórios de qualidade
- `GET /api/orders/quality/metrics` - Métricas de qualidade

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
# Frontend
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build

# Backend
npm run dev          # Inicia servidor com hot reload
npm run build        # Compila TypeScript
npm run start        # Inicia servidor compilado
npm run seed         # Popula banco com dados iniciais
```

### Estrutura de Autenticação
O sistema utiliza JWT tokens armazenados no localStorage. Todas as requisições são automaticamente autenticadas através de interceptors do Axios.

## 📊 Monitoramento

O sistema inclui logs detalhados para:
- Autenticação de usuários
- Operações CRUD
- Erros de sistema
- Performance de queries

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato através dos canais oficiais da empresa.

---

**MRP2 CPU Manufacturing System** - Desenvolvido para otimizar a produção industrial de processadores com tecnologia de ponta. 