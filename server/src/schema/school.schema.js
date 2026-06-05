import { z } from 'zod';

const idParam = z.coerce
  .number({ invalid_type_error: 'id must be a number' })
  .int('id must be an integer')
  .positive('id must be positive');

export const createSchoolSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').max(150),
    code: z.string().trim().min(1).max(30).optional(),
    email: z.string().trim().email('Invalid email address').max(150).optional(),
    phone: z.string().trim().max(20).optional(),
    address: z.string().trim().max(255).optional(),
  }),
});

export const schoolIdSchema = z.object({
  params: z.object({ id: idParam }),
});

export const updateSchoolStatusSchema = z.object({
  params: z.object({ id: idParam }),
  body: z.object({
    status: z.enum(['active', 'inactive'], {
      errorMap: () => ({ message: "Status must be 'active' or 'inactive'" }),
    }),
  }),
});

export const createSchoolAdminSchema = z.object({
  params: z.object({ id: idParam }),
  body: z.object({
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
