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
 * - Otimizações de build para melhor performance
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
    
    // 📦 CONFIGURAÇÕES DE BUILD
    build: {
        // 🚀 OTIMIZAÇÕES DE MINIFICAÇÃO
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,     // Remove console.log em produção
                drop_debugger: true,    // Remove debugger em produção
            }
        },
        
        // 📈 CONFIGURAÇÕES DE TAMANHO
        chunkSizeWarningLimit: 1000,    // Aumenta limite para 1MB
        
        // 📊 RELATÓRIO DE BUNDLE
        reportCompressedSize: true,
    },
    
    // ⚡ OTIMIZAÇÕES DE DEPS
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            '@mui/material',
            '@mui/icons-material',
            'axios',
            'date-fns'
        ]
    },
    
    // 📦 BASE: Caminho base da aplicação (raiz)
    base: '/',
}); 