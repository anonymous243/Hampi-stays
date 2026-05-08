const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting database cleanup...');

  // Delete everything in order to respect foreign keys
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.roomBlocking.deleteMany();
  await prisma.roomPriceOverride.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.room.deleteMany();
  await prisma.resort.deleteMany();
  await prisma.resortOwner.deleteMany();
  await prisma.user.deleteMany();

  console.log('✨ All data cleared.');

  // Create a fresh Admin account so you can log in
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash('admin123', salt);

  await prisma.user.create({
    data: {
      email: 'admin@hampistays.com',
      name: 'HampiStays Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('👑 Fresh Admin account created: admin@hampistays.com / admin123');
  console.log('🚀 Ready for new data entry.');
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
