import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Department name is required')
    .max(100, 'Department name must be 100 characters or fewer'),
});
