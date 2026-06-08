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
    .max(30, 'Code must be 30 characters or fewer')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email')
    .max(150)
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(20, 'Phone must be 20 characters or fewer')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .max(255, 'Address must be 255 characters or fewer')
    .optional()
    .or(z.literal('')),
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
    .max(20, 'Phone must be 20 characters or fewer')
    .optional()
    .or(z.literal('')),
});
