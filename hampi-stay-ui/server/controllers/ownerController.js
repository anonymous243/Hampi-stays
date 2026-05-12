import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all resorts for a specific owner (by user ID)
 */
export const getOwnerResorts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Find the resort owner profile for this user
    const owner = await prisma.resortOwner.findUnique({
      where: { userId },
      include: {
        resorts: {
          include: {
            roomTypes: {
              include: {
                priceOverrides: true,
                blockings: true
              }
            },
            bookings: {
              include: {
                user: true
              }
            },
            discountCodes: true
          }
        }
      }
    });

    if (!owner) {
      // If no owner profile exists, return an empty array for resorts
      // This is a common case for new users
      return res.json([]);
    }

    res.json(owner.resorts);
  } catch (error) {
    next(error);
  }
};

/**
 * Get owner dashboard stats
 */
export const getOwnerStats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const owner = await prisma.resortOwner.findUnique({
      where: { userId },
      include: {
        resorts: {
          include: {
            bookings: true
          }
        }
      }
    });

    if (!owner) return res.json({ revenue: 0, bookings: 0, rating: 0 });

    const resorts = owner.resorts;
    const totalRevenue = resorts.reduce((sum, r) => 
      sum + r.bookings.reduce((bSum, b) => bSum + (b.status !== 'CANCELLED' ? b.totalPrice : 0), 0)
    , 0);
    const totalBookings = resorts.reduce((sum, r) => sum + r.bookings.length, 0);
    const avgRating = resorts.reduce((sum, r) => sum + (r.rating || 5), 0) / (resorts.length || 1);

    res.json({
      revenue: totalRevenue,
      bookings: totalBookings,
      rating: avgRating.toFixed(1)
    });
  } catch (error) {
    next(error);
  }
};
