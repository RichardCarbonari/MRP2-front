import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  role: 'admin' | 'employee' | 'maintenance';
}

const authService = {
  login: async (data: LoginData) => {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      throw new Error('Senha incorreta');
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  },

  register: async (data: RegisterData) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role
      }
    });

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  },

  validateToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  },

  verifyEmail: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Email não encontrado');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  },

  resetPassword: async (email: string, newPassword: string) => {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Email não encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    return {
      message: 'Senha alterada com sucesso',
      timestamp: new Date().toISOString()
    };
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se a senha atual está correta
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      throw new Error('Senha atual incorreta');
    }

    // Verificar se a nova senha é diferente da atual
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      throw new Error('Nova senha deve ser diferente da atual');
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha no banco
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return {
      message: 'Senha alterada com sucesso',
      timestamp: new Date().toISOString()
    };
  }
};

export default authService; 