import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const cleanDatabase = async (req, res) => {
  try {
    console.log('🧹 Starting remote database cleanup...');

    // 1. Transactional data
    await prisma.message.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.guideBooking.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.wishlist.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.invitation.deleteMany({});

    // 2. Profiles
    await prisma.experience.deleteMany({});
    await prisma.guideProfile.deleteMany({});
    await prisma.staffMember.deleteMany({});

    // 3. Resorts
    await prisma.roomPriceOverride.deleteMany({});
    await prisma.roomBlocking.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.discountCode.deleteMany({});
    await prisma.resort.deleteMany({});
    await prisma.resortOwner.deleteMany({});

    // 4. Users (Keeping ADMINS)
    const deleteUsersResult = await prisma.user.deleteMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    });

    await prisma.otpVerification.deleteMany({});

    console.log('✅ Remote cleanup complete!');
    
    res.json({ 
      success: true, 
      message: `Database cleaned. ${deleteUsersResult.count} non-admin users removed.` 
    });

  } catch (error) {
    console.error('❌ Remote cleanup failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
