import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function purgeFakeData() {
  console.log('🧹 Starting Surgical Database Purge...');
  
  try {
    // 1. Identify the Admin to keep
    const adminEmail = 'admin@hampistays.com';
    const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!adminUser) {
      console.error('❌ Admin user not found! Please run seed first or create an admin.');
      return;
    }

    console.log(`👑 Preserving Admin: ${adminUser.email}`);

    // 2. Delete dependent data first
    await prisma.message.deleteMany();
    await prisma.review.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.guideBooking.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.otpVerification.deleteMany();
    await prisma.invitation.deleteMany();
    await prisma.staffMember.deleteMany();
    await prisma.roomPriceOverride.deleteMany();
    await prisma.roomBlocking.deleteMany();
    await prisma.discountCode.deleteMany();
    
    // 3. Delete Resort and Room data
    await prisma.room.deleteMany();
    await prisma.resort.deleteMany();
    
    // 4. Delete Profiles
    // Keep the admin's owner profile if it exists
    const adminOwnerProfile = await prisma.resortOwner.findFirst({ where: { userId: adminUser.id } });
    await prisma.resortOwner.deleteMany({
      where: {
        NOT: {
          id: adminOwnerProfile?.id || 'non-existent'
        }
      }
    });
    
    await prisma.guideProfile.deleteMany();

    // 5. Delete all users except the Admin
    const deleteUsersResult = await prisma.user.deleteMany({
      where: {
        NOT: {
          id: adminUser.id
        }
      }
    });

    console.log(`✅ Deleted ${deleteUsersResult.count} test users.`);
    console.log('✅ All test resorts and data removed.');
    console.log('🚀 Your database is now a clean slate. Only the Admin remains.');

  } catch (error) {
    console.error('❌ Error during purge:', error);
  } finally {
    await prisma.$disconnect();
  }
}

purgeFakeData();
