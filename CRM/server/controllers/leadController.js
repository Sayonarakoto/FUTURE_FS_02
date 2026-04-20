// server/controllers/leadController.js — Lead CRUD Controller

import Lead from '../models/Lead.js';
import { sendLeadNotification } from '../utils/mailer.js'; // Moved this import to the top

/**
 * GET /api/leads
 * Fetches all leads ordered by creation date (newest first).
 * Protected: Requires auth middleware.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({
      attributes: ['id', 'name', 'email', 'status', 'message', 'createdAt'],
    order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error('GetAllLeads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leads',
    });
  }
};

/**
 * GET /api/leads/:id
 * Fetches a single lead by ID.
 * Protected: Requires auth middleware.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getLeadById = async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await Lead.findByPk(parseInt(id, 10));

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${id} not found`,
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('GetLeadById error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching lead',
    });
  }
};

/**
 * POST /api/leads
 * Creates a new lead from a public contact form submission.
 * Public: No auth required.
 *
 * @param {import('express').Request} req - Body: { name, email, inquiryType, message }
 * @param {import('express').Response} res
 */
export const createLead = async (req, res) => {
  const { name, email, inquiryType, message } = req.body;

  try {
    // Check for duplicate email submissions
    const existingLead = await Lead.findOne({
      where: { email },
    });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: 'A lead with this email already exists',
      });
    }

    const lead = await Lead.create({
      name, email, inquiryType, message
    });

    // Call the new notification function
    sendLeadNotification(lead).catch(err => console.error("Email failed:", err));

    // Respond to the React Frontend
    res.status(201).json({
      success: true,
      message: 'Lead submitted successfully',
      data: lead,
    });

  } catch (error) {
    console.error('CreateLead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating lead',
    });
  }
};

/**
 * PUT /api/leads/:id/status
 * Updates the status and notes for a lead.
 * Protected: Requires auth middleware.
 *
 * @param {import('express').Request} req - Params: { id }, Body: { status }
 * @param {import('express').Response} res
 */
export const updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // 1. Find and update the lead
    const [updatedRows] = await Lead.update(
      { status }, 
      { where: { id: parseInt(id, 10) } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${id} not found`,
      });
    }

    // 2. Fetch the updated record to send back
    const updatedLead = await Lead.findByPk(parseInt(id, 10));
    
    console.log(`✅ TiDB: Status updated for lead ${id} to ${status}`);
    res.status(200).json({
      success: true,
      data: updatedLead
    });
  } catch (error) {
    console.error('❌ Update Error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update lead status" 
    });
  }
};

/**
 * DELETE /api/leads/:id
 * Deletes a lead permanently (admin action).
 * Protected: Requires auth middleware.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteLead = async (req, res) => {
  const { id } = req.params;

  try {
    const existingLead = await Lead.findByPk(parseInt(id, 10));

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${id} not found`,
      });
    }

    await Lead.destroy({
      where: { id: parseInt(id, 10) },
    });

    res.json({
      success: true,
      message: `Lead with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error('DeleteLead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting lead',
    });
  }
};
