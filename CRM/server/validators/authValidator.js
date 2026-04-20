// server/validators/authValidator.js — Zod schemas for Auth input validation

import { z } from 'zod';

/**
 * Schema for admin registration.
 * @property {string} email - Valid email address
 * @property {string} password - Minimum 8 characters
 */
export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be under 128 characters'),
});

/**
 * Schema for admin login.
 * @property {string} email - Valid email address
 * @property {string} password - Non-empty password
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
});
