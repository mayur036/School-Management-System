import { z } from 'zod';

export const editProfileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(80, 'First name must be 80 characters or fewer'),
  last_name: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(80, 'Last name must be 80 characters or fewer'),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .trim()
    .max(500, 'Bio must be 500 characters or fewer')
    .optional()
    .or(z.literal('')),
  timezone: z.string().trim().min(1, 'Time zone is required'),
  language: z.string().trim().min(1, 'Language is required'),
});
