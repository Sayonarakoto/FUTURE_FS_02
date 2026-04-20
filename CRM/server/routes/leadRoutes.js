// server/routes/leadRoutes.js — Lead API Routes

import express from 'express';
const router = express.Router();

// Import the auth middleware correctly
import { authenticate } from '../middleware/authMiddleware.js'; 
import { getAllLeads, getLeadById, createLead, updateLeadStatus, deleteLead } from '../controllers/leadController.js';
import { seedLeads } from '../controllers/seedController.js';

// Seed route (for testing)
router.post('/seed', seedLeads);

// Public route for creating a lead (e.g., from a contact form)
router.post('/', createLead);

// Routes protected by authentication middleware
router.use(authenticate); // Apply auth middleware to all routes below

// Get all leads (protected)
router.get('/', getAllLeads);

// Get a single lead by ID (protected)
router.get('/:id', getLeadById);

// Update lead status (protected)
router.put('/:id/status', updateLeadStatus);

// Delete a lead (protected)
router.delete('/:id', deleteLead);

export default router;
