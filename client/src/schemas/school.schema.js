import { z } from 'zod';

export const createSchoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'School name is required')
    .max(150, 'Name must be 150 characters or fewer'),
  code: z
    .string()
    .trim()
    .min(1, 'Code is required')
    .max(30, 'Code must be 30 characters or fewer'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email')
    .max(150),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  address: z
    .string()
    .trim()
    .min(1, 'Address is required')
    .max(255, 'Address must be 255 characters or fewer'),
});

export const createSchoolAdminSchema = z.object({
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
  email: z
    .string()
    .trim()
    .email('Please enter a valid email')
    .max(150, 'Email must be 150 characters or fewer'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be 72 characters or fewer'),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
});

export const updateSchoolBySuperSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'School name cannot be empty')
    .max(150, 'Name must be 150 characters or fewer')
    .optional(),
  code: z
    .string()
    .trim()
    .min(1, 'Code cannot be empty')
    .max(30, 'Code must be 30 characters or fewer')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email')
    .max(150)
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .optional()
    .nullable()
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .min(1, 'Address cannot be empty')
    .max(255, 'Address must be 255 characters or fewer')
    .optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateSchoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'School name is required')
    .max(150, 'Name must be 150 characters or fewer'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email')
    .max(150),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .optional()
    .nullable()
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .min(1, 'Address is required')
    .max(255, 'Address must be 255 characters or fewer'),
});
