# 🔐 Credenciais de Acesso - MRP2 Sistema de Manufatura

## 👥 Usuários do Sistema

### 🔑 Administrador
- **Nome**: Carlos Diretor
- **Email**: `carlos.diretor@mrp2cpu.com.br`
- **Senha**: `admin123`
- **Papel**: Administrador
- **Acesso**: Completo a todos os módulos

### 🔧 Manutenção
- **Nome**: João Manutenção
- **Email**: `joao.manutencao@mrp2cpu.com.br`
- **Senha**: `manutencao123`
- **Papel**: Manutenção
- **Acesso**: Módulo de manutenção e equipamentos

### 👷 Funcionário
- **Nome**: Maria Substrato
- **Email**: `maria.substrato@mrp2cpu.com.br`
- **Senha**: `funcionario123`
- **Papel**: Funcionário
- **Departamento**: Montagem Substrato
- **Acesso**: Módulos do departamento

## 🌐 URLs do Sistema

### Desenvolvimento
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3006/api
- **Prisma Studio**: http://localhost:5555

### Endpoints Principais
- **Login**: `POST /api/auth/login`
- **Manutenção**: `GET /api/maintenance/requests`
- **Financeiro**: `GET /api/financial/cpu-sales`
- **Pedidos**: `GET /api/orders`
- **Qualidade**: `GET /api/orders/quality/reports`

## 🗄️ Banco de Dados

### Configuração
- **Tipo**: SQLite
- **Arquivo**: `backend/prisma/dev.db`
- **ORM**: Prisma
- **Studio**: `npx prisma studio`

### Comandos Úteis
```bash
# Visualizar banco
npx prisma studio

# Resetar banco
rm backend/prisma/dev.db
cd backend && npx prisma db push && npm run seed

# Backup
cp backend/prisma/dev.db backup_$(date +%Y%m%d).db
```

## 🚀 Como Iniciar o Sistema

### 1. Preparação
```bash
# Clone o projeto
git clone <repository-url>
cd MRP2-front

# Instale dependências do frontend
npm install --legacy-peer-deps

# Instale dependências do backend
cd backend
npm install
```

### 2. Configuração do Banco
```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
```

### 3. Iniciar Serviços

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
*Servidor rodará na porta 3006*

**Terminal 2 - Frontend:**
```bash
npm run dev
```
*Interface rodará na porta 3000*

### 4. Acesso ao Sistema
1. Abra http://localhost:3000
2. Use uma das credenciais acima
3. Navegue pelos módulos conforme seu papel

## 🏭 Departamentos e Equipamentos

### Montagem Substrato
- **Equipamentos**: Máquina de Solda SMD
- **Funcionário**: maria.substrato@mrp2cpu.com.br

### Bonding
- **Equipamentos**: Forno de Refusão
- **Processo**: Conexão dos componentes eletrônicos

### Encapsulamento
- **Equipamentos**: Máquina de Encapsulamento
- **Processo**: Proteção e acabamento dos chips

### Testes
- **Equipamentos**: Testador Automático
- **Processo**: Controle de qualidade e validação

### Embalagem
- **Equipamentos**: Seladora de Embalagem
- **Processo**: Preparação para distribuição

## 🔧 Funcionalidades por Papel

### 👑 Administrador (carlos.diretor@mrp2cpu.com.br)
- ✅ Dashboard completo
- ✅ Módulo Financeiro
- ✅ Gerenciamento de Pedidos
- ✅ Relatórios de Qualidade
- ✅ Controle de Inventário
- ✅ Planejamento de Produção
- ✅ Gerenciamento de Usuários
- ✅ Configurações do Sistema

### 🔧 Manutenção (joao.manutencao@mrp2cpu.com.br)
- ✅ Dashboard de Manutenção
- ✅ Visualizar Solicitações
- ✅ Gerenciar Equipamentos
- ✅ Atualizar Status de Solicitações
- ✅ Upload de Imagens
- ✅ Relatórios de Manutenção

### 👷 Funcionário (maria.substrato@mrp2cpu.com.br)
- ✅ Dashboard do Departamento
- ✅ Criar Solicitações de Manutenção
- ✅ Visualizar Histórico
- ✅ Acompanhar Status
- ✅ Upload de Imagens

## 📊 Dados de Exemplo

### CPUs Disponíveis
- **Gaming Pro**: R$ 2.500,00
- **Office Standard**: R$ 1.200,00
- **Server Enterprise**: R$ 4.800,00
- **Workstation Ultra**: R$ 3.200,00

### Métricas Financeiras
- **Receita Total**: R$ 2.450.000,00
- **Lucro Bruto**: R$ 1.225.000,00
- **Lucro Líquido**: R$ 857.500,00
- **Margem de Lucro**: 35%

## 🛠️ Troubleshooting Rápido

### Problema: Erro 401 na página financeira
**Solução**: O token JWT não está sendo enviado. Já foi corrigido com interceptors do Axios.

### Problema: "Could not resolve react"
**Solução**: 
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Problema: Porta em uso
**Solução**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Problema: Banco de dados travado
**Solução**:
```bash
cd backend
rm prisma/dev.db
npx prisma db push
npm run seed
```

## 📱 Contatos de Suporte

### Desenvolvimento
- **Email**: dev@mrp2cpu.com.br
- **Telefone**: (11) 9999-9999

### Administração
- **Email**: admin@mrp2cpu.com.br
- **Telefone**: (11) 8888-8888

### Manutenção
- **Email**: manutencao@mrp2cpu.com.br
- **Telefone**: (11) 7777-7777

## 🔒 Segurança

### Tokens JWT
- **Expiração**: 24 horas
- **Armazenamento**: localStorage
- **Renovação**: Automática no login

### Senhas
- **Criptografia**: bcrypt
- **Salt Rounds**: 10
- **Política**: Mínimo 6 caracteres

### CORS
- **Origens Permitidas**: 
  - http://localhost:3000
  - http://localhost:3001
  - http://localhost:3002

## 📋 Checklist de Verificação

### ✅ Sistema Funcionando
- [ ] Backend rodando na porta 3006
- [ ] Frontend rodando na porta 3000
- [ ] Banco de dados criado e populado
- [ ] Login funcionando com todas as credenciais
- [ ] Módulos acessíveis conforme papel do usuário
- [ ] Upload de imagens funcionando
- [ ] APIs retornando dados corretos

### ✅ Testes de Funcionalidade
- [ ] Login com admin → Acesso completo
- [ ] Login com manutenção → Módulo de manutenção
- [ ] Login com funcionário → Criar solicitação
- [ ] Página financeira carregando dados
- [ ] Criação de pedidos funcionando
- [ ] Relatórios de qualidade acessíveis

---

**Sistema MRP2** - Todas as informações necessárias para acesso e operação do sistema de manufatura de CPUs.

*Última atualização: $(date)* 