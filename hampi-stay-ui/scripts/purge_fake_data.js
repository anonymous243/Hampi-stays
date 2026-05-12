import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function purge() {
  console.log('🧹 Starting database purge of fake data...');
  try {
    // 1. Delete all bookings, messages, reviews, notifications
    await prisma.booking.deleteMany();
    await prisma.message.deleteMany();
    await prisma.review.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.otpVerification.deleteMany();

    // 2. Delete all resorts (and related rooms, etc.)
    await prisma.room.deleteMany();
    await prisma.resort.deleteMany();

    // 3. Delete all guides and experiences
    await prisma.experience.deleteMany();
    await prisma.guideProfile.deleteMany();

    // 4. Delete all users EXCEPT the admin
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: { not: 'admin@hampistays.com' }
      }
    });

    console.log(`✅ Purge complete!`);
    console.log(`🗑️ Removed all sample data.`);
    console.log(`👤 Protected Admin Account.`);
    console.log(`👥 Deleted ${deletedUsers.count} sample users.`);
    
  } catch (err) {
    console.error('❌ Error during purge:', err);
  } finally {
    await prisma.$disconnect();
  }
}

purge();
