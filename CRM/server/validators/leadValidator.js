// server/validators/leadValidator.js — Zod schemas for Lead input validation

import { z } from 'zod';

/**
 * Schema for creating a new lead (public contact form).
 * @property {string} name - Lead's full name (2–100 chars)
 * @property {string} email - Valid email address
 * @property {string} message - Contact message (10–2000 chars)
 */
export const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  message: z
    .string({ required_error: 'Message is required' })
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be under 2000 characters')
    .trim(),
});

/**
 * Schema for updating lead status (admin action).
 * @property {string} status - One of: New, Contacted, Converted, Rejected
 * @property {string} [note] - Optional admin note
 */
export const updateLeadSchema = z.object({
  status: z
    .enum(['New', 'Contacted', 'Converted', 'Rejected'], {
      errorMap: () => ({ message: 'Status must be one of: New, Contacted, Converted, Rejected' }),
    }),
  note: z
    .string()
    .max(1000, 'Note must be under 1000 characters')
    .trim()
    .optional()
    .nullable(),
});

/**
 * Validation middleware factory.
 * Wraps a Zod schema and returns Express middleware that validates req.body.
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors?.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
};
