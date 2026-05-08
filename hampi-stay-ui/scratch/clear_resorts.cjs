const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearData() {
  console.log('🗑️ Clearing ALL platform data (Users, Resorts, Bookings)...');
  
  // Order matters for foreign keys
  await prisma.booking.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.roomPriceOverride.deleteMany({});
  await prisma.roomBlocking.deleteMany({});
  await prisma.discountCode.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.resort.deleteMany({});
  await prisma.resortOwner.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('✅ Database completely cleared. Platform is now at Zero State.');
  process.exit(0);
}

clearData().catch(e => {
  console.error(e);
  process.exit(1);
});
