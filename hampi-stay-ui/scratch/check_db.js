const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  const owners = await prisma.resortOwner.findMany();
  console.log('Users:', users.map(u => ({ id: u.id, name: u.name, role: u.role })));
  console.log('Owners:', owners.map(o => ({ id: o.id, userId: o.userId })));
  process.exit(0);
}

check();
