import { z } from 'zod';

const idParam = z.coerce
  .number({ invalid_type_error: 'id must be a number' })
  .int('id must be an integer')
  .positive('id must be positive');

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
  }),
});

export const updateDepartmentStatusSchema = z.object({
  params: z.object({ id: idParam }),
  body: z.object({
    status: z.enum(['active', 'inactive'], {
      errorMap: () => ({ message: "Status must be 'active' or 'inactive'" }),
    }),
  }),
});
