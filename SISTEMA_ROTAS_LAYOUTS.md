# Sistema de Rotas e Layouts - MRP2

## Visão Geral

O sistema MRP2 foi adaptado com um sistema de rotas e layouts flexível e organizado, que oferece diferentes experiências de interface baseadas no tipo de usuário.

## Tipos de Usuário

### 1. **Admin** 
- Acesso completo ao sistema
- Dashboard administrativo completo
- Todas as funcionalidades disponíveis

### 2. **Employee** (Funcionário)
- Acesso limitado e focado
- Funcionalidades específicas do dia a dia
- Interface simplificada

### 3. **Maintenance** (Manutenção)
- Acesso especializado para técnicos
- Gerenciamento de pedidos de manutenção
- Dashboard focado em manutenção

## Estrutura de Layouts

### Layout Automático por Usuário
O sistema detecta automaticamente o tipo de usuário logado e aplica o layout correspondente:

```typescript
// src/components/Layout/index.tsx
const Layout = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    switch (user.role) {
        case 'admin': return <AdminLayout>{children}</AdminLayout>;
        case 'employee': return <EmployeeLayout>{children}</EmployeeLayout>;
        case 'maintenance': return <MaintenanceLayout>{children}</MaintenanceLayout>;
        default: return <LoginLayout>{children}</LoginLayout>;
    }
};
```

### Layouts Disponíveis

#### 1. **AdminLayout** - Layout Administrativo
- **Cor Principal**: #1DB954 (Verde)
- **Navegação**: Dashboard, Administração, Planejamento, Equipes, Estoque, Qualidade, Financeiro, Manutenção, Configurações
- **Título**: "MRP2 - Sistema Administrativo"

#### 2. **EmployeeLayout** - Layout do Funcionário
- **Cor Principal**: #1DB954 (Verde)
- **Navegação**: Início, Registro de Qualidade, Pedidos de Manutenção
- **Título**: "MRP2 - Portal do Funcionário"

#### 3. **MaintenanceLayout** - Layout de Manutenção
- **Cor Principal**: #1DB954 (Verde)
- **Navegação**: Home, Pedidos de Manutenção, Gerenciamento
- **Título**: "MRP2 - Sistema de Manutenção"

#### 4. **LoginLayout** - Layout de Login
- **Visual**: Gradiente verde com design moderno
- **Características**: Formulário centralizado, sem navegação

## Rotas Organizadas

### Rotas Públicas
```
/login - Página de login
/ - Redirecionamento automático baseado no usuário
```

### Rotas do Admin
```
/admin-home - Dashboard administrativo
/admin - Painel de administração
/planning - Planejamento
/teams-management - Gestão de equipes
/inventory - Controle de estoque
/quality-admin - Administração de qualidade
/financial - Gestão financeira
/maintenance - Manutenção (visão admin)
/settings - Configurações do sistema
```

### Rotas do Employee
```
/employee-home - Dashboard do funcionário
/employee - Painel do funcionário
/quality-register - Registro de qualidade
/maintenance-requests - Pedidos de manutenção
```

### Rotas de Maintenance
```
/maintenance-home - Dashboard de manutenção
/maintenance/management - Gerenciamento de manutenção
/maintenance-requests - Pedidos de manutenção (compartilhado)
```

## Sistema de Proteção de Rotas

Cada rota é protegida baseada no tipo de usuário:

```typescript
<ProtectedRoute allowedRoles={['admin', 'employee']}>
    <ComponentePage />
</ProtectedRoute>
```

### Redirecionamentos Automáticos
- **Usuário não autenticado** → `/login`
- **Usuário sem permissão** → `/{userType}-home`
- **Login bem-sucedido** → Página inicial específica do usuário

## Estrutura de Arquivos

```
src/
├── components/
│   └── Layout/
│       ├── index.tsx          # Layout principal (auto-seleção)
│       ├── AdminLayout.tsx    # Layout para admin
│       ├── EmployeeLayout.tsx # Layout para employee
│       ├── MaintenanceLayout.tsx # Layout para maintenance
│       └── LoginLayout.tsx    # Layout para login
├── routes/
│   └── index.tsx             # Configuração de todas as rotas
├── contexts/
│   └── AuthContext.tsx       # Contexto de autenticação
└── App.tsx                   # App principal simplificado
```

## Como Usar

### 1. **Adicionar Nova Rota**
```typescript
// Em src/routes/index.tsx
<Route 
    path="/nova-rota" 
    element={
        <ProtectedRoute allowedRoles={['admin']}>
            <NovaPage />
        </ProtectedRoute>
    } 
/>
```

### 2. **Modificar Navegação**
```typescript
// Em src/components/Layout/AdminLayout.tsx
const navigationItems = [
    { label: 'Nova Seção', path: '/nova-secao' },
    // ... outros itens
];
```

### 3. **Personalizar Layout**
Cada layout pode ser modificado independentemente:
- **Cores**: Altere `backgroundColor` e `color`
- **Navegação**: Modifique o array `navigationItems`
- **Título**: Altere o `Typography` no header

## Características do Sistema

### ✅ **Vantagens**
- **Automático**: Layout aplicado automaticamente baseado no usuário
- **Organizado**: Rotas centralizadas e bem estruturadas
- **Seguro**: Proteção de rotas por tipo de usuário
- **Flexível**: Fácil de modificar e expandir
- **Consistente**: Design uniforme com a cor #1DB954

### 🔧 **Personalizações Fáceis**
- Adicionar novos tipos de usuário
- Modificar navegação por tipo
- Alterar cores e styling
- Adicionar novas rotas protegidas

### 📱 **Responsivo**
Todos os layouts são responsivos e funcionam bem em:
- Desktop
- Tablet
- Mobile

## Manutenção

Para manter o sistema:

1. **Novas funcionalidades**: Adicione em `/routes/index.tsx`
2. **Modificar navegação**: Edite o layout específico
3. **Novos tipos de usuário**: Adicione em `AuthContext` e crie novo layout
4. **Styling**: Mantenha consistência com `#1DB954`

Este sistema fornece uma base sólida e escalável pentru o projeto MRP2, permitindo fácil manutenção e expansão conforme necessário. 