import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

type UserRole = 'admin' | 'employee' | 'maintenance';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && typeof parsedUser.role === 'string' && 
          ['admin', 'employee', 'maintenance'].includes(parsedUser.role)) {
        setUser(parsedUser as User);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await authService.login({ email, password }) as AuthResponse;
      const { user: loggedUser, token } = response;
      
      if (typeof loggedUser.role === 'string' && 
          ['admin', 'employee', 'maintenance'].includes(loggedUser.role)) {
        const typedUser: User = {
          ...loggedUser,
          role: loggedUser.role as UserRole
        };
        
        setUser(typedUser);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(typedUser));
        
        return typedUser;
      } else {
        throw new Error('Tipo de usuário inválido');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
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