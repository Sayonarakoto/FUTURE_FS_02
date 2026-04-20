// server/controllers/analyticsController.js
import Lead from '../models/Lead.js';

/**
 * GET /api/analytics/leads-by-status
 * Fetches the count of leads grouped by their status.
 * Protected: Requires auth middleware.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getLeadsByStatus = async (req, res) => {
  try {
    // Use Sequelize's count method with a group by status
    // This will return an array of objects like [{ status: 'New', count: 5 }, ...]
    const leadCounts = await Lead.count({
      group: ['status'], // Group results by the 'status' column
      attributes: ['status'], // Select the status column
    });

    // Format the response for easier frontend consumption
    // e.g., { New: 5, Contacted: 3, ... }
    const formattedCounts = leadCounts.reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: formattedCounts,
    });
  } catch (error) {
    console.error('GetLeadsByStatus error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching lead status distribution',
    });
  }
};
