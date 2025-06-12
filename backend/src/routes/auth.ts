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

// Verificar email para recuperação de senha
router.post('/verify-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email é obrigatório'
      });
    }

    const result = await authService.verifyEmail(email);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Email não encontrado') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
});

// Redefinir senha
router.put('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        error: 'Email e nova senha são obrigatórios'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    const result = await authService.resetPassword(email, newPassword);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Email não encontrado') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

// Alterar senha (usuário logado)
router.put('/change-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Senha atual e nova senha são obrigatórias',
        field: 'currentPassword'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Nova senha deve ter pelo menos 6 caracteres',
        field: 'newPassword'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: 'Nova senha deve ser diferente da atual',
        field: 'newPassword'
      });
    }

    // Obter token do header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de autenticação não fornecido',
        field: 'currentPassword'
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = authService.validateToken(token) as any;
      const userId = decoded.userId;

      const result = await authService.changePassword(userId, currentPassword, newPassword);
      res.json(result);
    } catch (tokenError: any) {
      return res.status(401).json({
        error: 'Token inválido ou expirado',
        field: 'currentPassword'
      });
    }

  } catch (error: any) {
    console.error('❌ Erro ao alterar senha:', error);
    
    if (error.message === 'Senha atual incorreta') {
      return res.status(400).json({
        error: error.message,
        field: 'currentPassword'
      });
    }
    
    if (error.message === 'Nova senha deve ser diferente da atual') {
      return res.status(400).json({
        error: error.message,
        field: 'newPassword'
      });
    }
    
    next(error);
  }
});

export default router; 