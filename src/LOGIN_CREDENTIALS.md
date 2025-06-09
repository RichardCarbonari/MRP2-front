# 🔐 CREDENCIAIS DE LOGIN - MRP2 Sistema

## Usuários Disponíveis

### 👑 **Administrador**
- **Email:** `carlos.diretor@mrp2cpu.com.br`
- **Senha:** `admin123`
- **Tipo:** Admin
- **Acesso:** Todas as funcionalidades

### 👨‍💼 **Funcionário**
- **Email:** `funcionario@mrp2.com`
- **Senha:** `func123`
- **Tipo:** Employee
- **Acesso:** Funcionalidades básicas

### 🔧 **Manutenção**
- **Email:** `joao.manutencao@mrp2cpu.com.br`
- **Senha:** `manut123`
- **Tipo:** Maintenance
- **Acesso:** Funcionalidades de manutenção

## 🔄 **NOVA FUNCIONALIDADE**: Recuperação de Senha

### Como usar:
1. **Na página de login**, clique em "Esqueci minha senha"
2. **Digite um email válido** (um dos emails acima)
3. **Se o email existir**, o sistema permite definir nova senha diretamente
4. **Sem simulação de email** - alteração imediata!

### ✅ Emails válidos para teste:
- `carlos.diretor@mrp2cpu.com.br`
- `funcionario@mrp2.com`  
- `joao.manutencao@mrp2cpu.com.br`

## 🔑 Para Mudança de Senha

Para testar a funcionalidade de mudança de senha em `/settings`:
- **Senha atual padrão:** `senha123`
- Digite uma nova senha com pelo menos 6 caracteres
- Confirme a nova senha

## 🚀 Backend Status

O servidor backend está rodando em: `http://localhost:3006`

### Endpoints de Autenticação:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro  
- `POST /api/auth/verify-email` - ✨ **NOVO** - Verificar email para recuperação
- `PUT /api/auth/reset-password` - ✨ **NOVO** - Redefinir senha
- `PUT /api/auth/change-password` - Mudança de senha

### Health Check:
- `GET /health` - Status do servidor 