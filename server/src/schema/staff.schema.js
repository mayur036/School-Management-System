import { z } from 'zod';

// Reusable: a positive integer route param (e.g. /staff/:id)
const idParam = z.coerce
  .number({ invalid_type_error: 'id must be a number' })
  .int('id must be an integer')
  .positive('id must be positive');

export const createStaffSchema = z.object({
  body: z.object({
    department_id: idParam,
    first_name: z.string().trim().min(1, 'First name is required').max(80),
    last_name: z.string().trim().min(1, 'Last name is required').max(80),
    email: z.string().trim().email('Invalid email address').max(150),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72),
    phone: z.string().trim().max(20).optional(),
  }),
});

export const staffIdSchema = z.object({
  params: z.object({ id: idParam }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(72),
  }),
});

export const updateStaffStatusSchema = z.object({
  params: z.object({ id: idParam }),
  body: z.object({
    status: z.enum(['active', 'inactive'], {
      errorMap: () => ({ message: "Status must be 'active' or 'inactive'" }),
    }),
  }),
});
