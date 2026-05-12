import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllExperiences = async (req, res, next) => {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        guide: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });
    res.json(experiences);
  } catch (error) {
    next(error);
  }
};

export const getExperienceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        guide: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.json(experience);
  } catch (error) {
    next(error);
  }
};
