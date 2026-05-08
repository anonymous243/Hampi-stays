const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      name: true
    }
  });
  const resorts = await prisma.resort.findMany({
    select: {
      name: true,
      status: true
    }
  });
  
  console.log('--- USERS ---');
  console.table(users);
  console.log('--- RESORTS ---');
  console.table(resorts);
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
