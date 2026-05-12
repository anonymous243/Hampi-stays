import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  console.log('Connecting to:', process.env.DATABASE_URL?.substring(0, 30) + '...');
  try {
    const count = await prisma.user.count();
    const admin = await prisma.user.findUnique({ where: { email: 'admin@hampistays.com' } });
    console.log(`Cloud DB User Count: ${count}`);
    console.log(`Admin User Found: ${!!admin}`);
  } catch (err) {
    console.error('Error checking cloud DB:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
