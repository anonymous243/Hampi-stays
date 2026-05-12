import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('🧹 Starting HampiStays Database Cleanup...');
  
  try {
    // Delete in order to respect foreign key constraints
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
    await prisma.room.deleteMany();
    await prisma.resort.deleteMany();
    await prisma.resortOwner.deleteMany();
    await prisma.guideProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.systemSettings.deleteMany();

    console.log('✅ Database Cleared Successfully!');
    
    // Optional: Re-seed basic settings if needed
    await prisma.systemSettings.create({
      data: {
        guideServiceEnabled: true
      }
    });
    console.log('✨ System Settings Initialized.');

  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
