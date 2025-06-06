# 📦 **DEPENDÊNCIAS DO PROJETO MRP2**

## **🎯 DEPENDÊNCIAS DE PRODUÇÃO (FRONTEND)**

### **📊 Dashboard e Gráficos**
- **`@devexpress/dx-react-core`** - Core dos componentes DevExtreme para React
- **`@devexpress/dx-react-scheduler`** - Componente de agendamento/cronograma
- **`@devexpress/dx-react-scheduler-material-ui`** - Interface Material-UI para o scheduler
- **`chart.js`** - Biblioteca principal para criação de gráficos
- **`react-chartjs-2`** - Wrapper React para Chart.js
- **`recharts`** - Biblioteca de gráficos responsivos para React

### **🎨 Interface e Componentes**
- **`@mui/lab`** - Componentes experimentais do Material-UI
- **`@mui/x-date-pickers`** - Seletores de data avançados do Material-UI

### **🌐 HTTP e Comunicação**
- **`axios`** - Cliente HTTP para comunicação com APIs REST

### **📅 Manipulação de Datas**
- **`date-fns`** - Biblioteca moderna para manipulação de datas

### **⚛️ React Core**
- **`react`** - Biblioteca principal do React
- **`react-dom`** - Renderizador React para DOM

---

## **🛠️ DEPENDÊNCIAS DE DESENVOLVIMENTO**

### **🎨 Material-UI (Interface)**
- **`@emotion/react`** - CSS-in-JS engine (dependência do MUI)
- **`@emotion/styled`** - Styled components com Emotion
- **`@mui/icons-material`** - Ícones do Material Design
- **`@mui/material`** - Componentes principais do Material-UI

### **🔀 Roteamento**
- **`react-router-dom`** - Roteamento para Single Page Applications
- **`@types/react-router-dom`** - Tipagens TypeScript para React Router

### **📝 TypeScript**
- **`@types/node`** - Tipagens TypeScript para Node.js
- **`@types/react`** - Tipagens TypeScript para React
- **`@types/react-dom`** - Tipagens TypeScript para React DOM
- **`typescript`** - Compilador TypeScript

### **🔍 Linting e Qualidade de Código**
- **`@typescript-eslint/eslint-plugin`** - Plugin ESLint para TypeScript
- **`@typescript-eslint/parser`** - Parser TypeScript para ESLint
- **`eslint`** - Linter para JavaScript/TypeScript
- **`eslint-plugin-react-hooks`** - Regras ESLint específicas para React Hooks
- **`eslint-plugin-react-refresh`** - Regras ESLint para React Refresh

### **⚡ Build e Desenvolvimento**
- **`@vitejs/plugin-react-swc`** - Plugin Vite para React usando SWC (compilador rápido)
- **`vite`** - Build tool moderna e servidor de desenvolvimento

---

## **🔧 DEPENDÊNCIAS DO BACKEND**

### **🌐 Servidor Web**
- **`express`** - Framework web para Node.js
- **`cors`** - Middleware para habilitar CORS
- **`helmet`** - Middleware de segurança

### **🗄️ Banco de Dados**
- **`prisma`** - ORM moderno para Node.js e TypeScript
- **`@prisma/client`** - Cliente gerado pelo Prisma
- **`sqlite3`** - Driver SQLite

### **🔐 Autenticação e Segurança**
- **`jsonwebtoken`** - Implementação JWT para Node.js
- **`bcryptjs`** - Biblioteca para hash de senhas
- **`@types/jsonwebtoken`** - Tipagens para JWT
- **`@types/bcryptjs`** - Tipagens para bcrypt

### **📝 Desenvolvimento Backend**
- **`typescript`** - Compilador TypeScript
- **`ts-node`** - Executar TypeScript diretamente
- **`nodemon`** - Monitor de arquivos para desenvolvimento
- **`@types/node`** - Tipagens Node.js
- **`@types/express`** - Tipagens Express
- **`@types/cors`** - Tipagens CORS

---

## **📋 RESUMO DE VERSÕES CRÍTICAS**

| Tecnologia | Versão | Motivo da Escolha |
|------------|--------|-------------------|
| **Node.js** | 18+ | Suporte LTS, compatibilidade com Prisma |
| **React** | 18.2.0 | Versão estável com novas funcionalidades |
| **TypeScript** | 5.3.2 | Tipagem forte, melhor DX |
| **Material-UI** | 5.14.19 | Componentes modernos e acessíveis |
| **Vite** | 5.0.2 | Build rápido, HMR eficiente |
| **Prisma** | Latest | ORM moderno, type-safe |

---

## **⚠️ NOTAS IMPORTANTES**

### **Conflitos de Dependências:**
- Use `npm install --legacy-peer-deps` para resolver conflitos de peer dependencies
- Material-UI requer versões específicas do Emotion

### **Atualizações Futuras:**
- Manter React Router na v6 (v7 em beta)
- Material-UI v6 em desenvolvimento
- Vite v6 com melhorias de performance

### **Segurança:**
- Executar `npm audit` regularmente
- Manter dependências de segurança atualizadas
- Usar versões LTS do Node.js 