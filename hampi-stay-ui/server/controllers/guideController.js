import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllGuides = async (req, res, next) => {
  try {
    const guides = await prisma.guideProfile.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        experiences: true
      }
    });
    res.json(guides);
  } catch (error) {
    next(error);
  }
};

export const getGuideById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guide = await prisma.guideProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        experiences: true
      }
    });
    if (!guide) return res.status(404).json({ error: 'Guide not found' });
    res.json(guide);
  } catch (error) {
    next(error);
  }
};

export const bookGuide = async (req, res, next) => {
  try {
    const { guideId } = req.params;
    const { userId, date, durationHours, meetingPoint, totalPrice, specialRequests } = req.body;

    const booking = await prisma.guideBooking.create({
      data: {
        guideId,
        userId,
        date: new Date(date),
        durationHours,
        meetingPoint,
        totalPrice,
        specialRequests,
        status: 'PENDING'
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};
