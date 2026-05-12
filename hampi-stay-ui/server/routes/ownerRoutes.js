import express from 'express';
import * as ownerController from '../controllers/ownerController.js';
import { authenticate, authorize } from '../middleware/security.js';

const router = express.Router();

// All owner routes require authentication and the RESORT_OWNER role
// However, we allow ADMIN to view as well for support
router.use(authenticate);

/**
 * @route GET /api/owners/:userId/resorts
 * @desc Get all resorts for an owner
 */
router.get('/:userId/resorts', ownerController.getOwnerResorts);

/**
 * @route GET /api/owners/:userId/stats
 * @desc Get dashboard stats for an owner
 */
router.get('/:userId/stats', ownerController.getOwnerStats);

export default router;
