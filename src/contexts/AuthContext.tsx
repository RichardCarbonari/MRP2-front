import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'admin' | 'employee' | 'maintenance';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAdmin: () => boolean;
  isEmployee: () => boolean;
  isMaintenance: () => boolean;
  userType: UserRole | null;
  getHomePage: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Simula verificação de token ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Simulação de autenticação
    // Em produção, isso seria uma chamada real à API
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      let mockUser: User;

      // Simula diferentes tipos de usuário baseado no email
      if (email.includes('admin')) {
        mockUser = {
          id: '1',
          name: 'Administrador',
          role: 'admin',
          email: email
        };
      } else if (email.includes('maintenance')) {
        mockUser = {
          id: '3',
          name: 'Manutenção',
          role: 'maintenance',
          email: email
        };
      } else {
        mockUser = {
          id: '2',
          name: 'Funcionário',
          role: 'employee',
          email: email
        };
      }

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Falha na autenticação');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => user?.role === 'admin';
  const isEmployee = () => user?.role === 'employee';
  const isMaintenance = () => user?.role === 'maintenance';

  const getHomePage = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin-home';
      case 'maintenance':
        return '/maintenance-home';
      case 'employee':
        return '/employee-home';
      default:
        return '/login';
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        login,
        logout,
        isAdmin,
        isEmployee,
        isMaintenance,
        userType: user?.role || null,
        getHomePage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 