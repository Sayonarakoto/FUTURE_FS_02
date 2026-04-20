import express from 'express';
const router = express.Router();
import { requestOTP, verifyOTP, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

// Passwordless OTP Authentication Flow
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

// Protected session check
router.get('/profile', authenticate, getProfile);

export default router;
