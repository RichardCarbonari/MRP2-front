import express, { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';

const router = express.Router();

// Middleware de validação para registro
const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({
      message: 'Todos os campos são obrigatórios: email, password, name, role'
    });
  }

  const validRoles = ['admin', 'employee', 'maintenance'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: 'Role inválido. Use: admin, employee ou maintenance'
    });
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Email inválido'
    });
  }

  // Validação básica de senha (mínimo 6 caracteres)
  if (password.length < 6) {
    return res.status(400).json({
      message: 'A senha deve ter no mínimo 6 caracteres'
    });
  }

  next();
};

// Login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email e senha são obrigatórios'
      });
    }

    const result = await authService.login({ email, password });
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Usuário não encontrado' || error.message === 'Senha incorreta') {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
});

// Registro
router.post('/register', validateRegister, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'Email já está em uso') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

export default router; 