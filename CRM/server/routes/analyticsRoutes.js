// server/routes/analyticsRoutes.js
import express from 'express';
const router = express.Router();
import { getLeadsByStatus } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

// Route to get lead distribution by status
// This route is protected and requires authentication
router.get('/leads-by-status', authenticate, getLeadsByStatus);

export default router;
