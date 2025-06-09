import { lazy } from 'react';

/**
 * 🚀 LAZY IMPORTS OTIMIZADOS
 * 
 * Centraliza todos os imports lazy para melhor organização
 * e permite preloading estratégico de componentes críticos
 */

// 📄 PÁGINAS PRINCIPAIS
export const LazyLogin = lazy(() => import('../pages/Login'));
export const LazyAdminHome = lazy(() => import('../pages/AdminHome'));
export const LazyEmployeeHome = lazy(() => import('../pages/EmployeeHome'));
export const LazyMaintenanceHome = lazy(() => import('../pages/MaintenanceHome'));

// 📊 PÁGINAS DE GESTÃO
export const LazyPlanning = lazy(() => import('../pages/Planning'));
export const LazyInventory = lazy(() => import('../pages/Inventory'));
export const LazyFinancial = lazy(() => import('../pages/Financial'));
export const LazyMaintenance = lazy(() => import('../pages/Maintenance'));

// 👥 PÁGINAS DE USUÁRIOS
export const LazyTeamsManagement = lazy(() => import('../pages/TeamsManagement'));
export const LazyUserManagement = lazy(() => import('../pages/UserManagement'));
export const LazyEmployee = lazy(() => import('../pages/Employee'));

// 🔧 PÁGINAS DE MANUTENÇÃO
export const LazyMaintenanceRequests = lazy(() => import('../pages/MaintenanceRequests'));
export const LazyMaintenanceManagement = lazy(() => import('../pages/MaintenanceManagement'));

// 🎯 PÁGINAS DE QUALIDADE
export const LazyQualityAdmin = lazy(() => import('../pages/QualityAdmin'));
export const LazyQualityRegister = lazy(() => import('../pages/QualityRegister'));

// 💰 PÁGINAS FINANCEIRAS
export const LazyFinancialInput = lazy(() => import('../pages/FinancialInput'));

// ⚙️ PÁGINAS DE CONFIGURAÇÃO
export const LazySettings = lazy(() => import('../pages/Settings'));

/**
 * 🎯 PRELOAD ESTRATÉGICO
 * 
 * Precarrega componentes críticos baseado no papel do usuário
 */
export const preloadCriticalComponents = (userRole: string) => {
  switch (userRole) {
    case 'admin':
      // Precarrega páginas mais usadas por admins
      import('../pages/Planning');
      import('../pages/Inventory');
      import('../pages/Financial');
      break;
    case 'employee':
      // Precarrega páginas mais usadas por funcionários
      import('../pages/Employee');
      import('../pages/QualityRegister');
      break;
    case 'maintenance':
      // Precarrega páginas de manutenção
      import('../pages/MaintenanceRequests');
      import('../pages/MaintenanceManagement');
      break;
  }
};

/**
 * 🔄 RETRY LOGIC
 * 
 * Implementa retry automático para imports que falharam
 */
export const retryLazyImport = (importFn: () => Promise<any>, retries = 3) => {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch((error) => {
        if (retries > 0) {
          setTimeout(() => {
            retryLazyImport(importFn, retries - 1).then(resolve, reject);
          }, 1000);
        } else {
          reject(error);
        }
      });
  });
}; 