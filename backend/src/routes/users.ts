import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, isAdmin } from '../middleware/auth';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();

// Listar todos os usuários (apenas admin)
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

// Criar novo usuário (apenas admin)
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validações
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        message: 'Todos os campos são obrigatórios: email, senha, nome e função'
      });
    }

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Validar função
    const validRoles = ['admin', 'maintenance', 'employee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: 'Função inválida. Use: admin, maintenance ou employee'
      });
    }

    // Criar usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

// Atualizar usuário (apenas admin)
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, name, role } = req.body;

    const updateData: any = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário (apenas admin)
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
});

export default router; 