import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'admin'
      }
    });

    console.log('✅ Usuário admin criado com sucesso:', admin.email);
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 