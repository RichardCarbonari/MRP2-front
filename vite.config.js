import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

/**
 * 🔧 CONFIGURAÇÃO DO VITE - BUILD TOOL FRONTEND
 * 
 * Este arquivo configura:
 * - Plugin React com SWC (compilador rápido)
 * - Aliases de importação (@/ aponta para src/)
 * - Servidor de desenvolvimento na porta 3000
 * - Proxy para redirecionar chamadas /api para o backend
 */

// https://vite.dev/config/
export default defineConfig({
    // 🔌 PLUGINS: React com SWC para compilação rápida
    plugins: [react()],
    
    // 📂 ALIAS: Permite usar @/ ao invés de ../../../src/
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    
    // 🌐 SERVIDOR DE DESENVOLVIMENTO
    server: {
        port: 3000,              // Porta do frontend
        open: true,              // Abrir navegador automaticamente
        host: true,              // Permitir acesso via IP da rede
        
        // 🔄 PROXY: Redireciona chamadas /api para o backend
        proxy: {
            '/api': {
                target: 'http://localhost:3006',    // Backend na porta 3006
                changeOrigin: true,                 // Alterar origin para evitar CORS
                secure: false,                      // Permitir HTTP (não HTTPS)
            },
            '/health': {
                target: 'http://localhost:3006',    // Health check do backend
                changeOrigin: true,
                secure: false,
            }
        }
    },
    
    // 📦 BASE: Caminho base da aplicação (raiz)
    base: '/',
});
