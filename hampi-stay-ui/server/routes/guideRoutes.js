import express from 'express';
import * as guideController from '../controllers/guideController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', guideController.getAllGuides);
router.get('/:id', guideController.getGuideById);

// Protected routes
router.post('/:guideId/book', authenticate, guideController.bookGuide);

export default router;
