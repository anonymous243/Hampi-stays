import express from 'express';
import * as experienceController from '../controllers/experienceController.js';

const router = express.Router();

router.get('/', experienceController.getAllExperiences);
router.get('/:id', experienceController.getExperienceById);

export default router;
