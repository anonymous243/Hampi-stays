import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting surgical user purge...');

  // 1. Delete all bookings
  const deletedBookings = await prisma.booking.deleteMany({});
  console.log(`✅ Deleted ${deletedBookings.count} bookings.`);

  // 2. Delete all rooms
  const deletedRooms = await prisma.room.deleteMany({});
  console.log(`✅ Deleted ${deletedRooms.count} rooms.`);

  // 3. Delete all resorts
  const deletedResorts = await prisma.resort.deleteMany({});
  console.log(`✅ Deleted ${deletedResorts.count} resorts.`);

  // 4. Delete all users EXCEPT the admin
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      NOT: {
        email: 'admin@hampistays.com'
      }
    }
  });
  console.log(`✅ Deleted ${deletedUsers.count} users.`);

  console.log('✨ Database is now CLEAN and ready for real data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during purge:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
