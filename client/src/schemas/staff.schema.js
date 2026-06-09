import { z } from 'zod';

export const createStaffSchema = z.object({
  department_id: z
    .union([z.string(), z.number()])
    .refine((val) => val !== '' && val !== undefined, {
      message: 'Please select a department',
    })
    .transform((val) => Number(val)),
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

// ── Batch registration (one department, many members) ──────────

export const staffMemberSchema = z.object({
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
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be 72 characters or fewer'),
  designation: z.string().trim().optional(),
});

export const batchRegisterStaffSchema = z.object({
  department_id: z
    .union([z.string(), z.number()])
    .refine((val) => val !== '' && val !== undefined, {
      message: 'Please select a department',
    })
    .transform((val) => Number(val)),
  members: z.array(staffMemberSchema).min(1, 'At least one member is required'),
});
