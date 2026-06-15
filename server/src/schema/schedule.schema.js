import { z } from 'zod';

const idParam = z.coerce
  .number({ invalid_type_error: 'id must be a number' })
  .int('id must be an integer')
  .positive('id must be positive');

const dayEnum = z.enum(
  [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
  { errorMap: () => ({ message: 'Invalid day of the week' }) }
);

// --- Period Validation ---
export const createPeriodSchema = z.object({
  body: z.object({
    period_name: z.string().trim().min(1, 'Period name is required').max(50),
    period_order: z.coerce
      .number()
      .int()
      .positive('Period order must be a positive integer'),
    start_time: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Start time must be HH:MM or HH:MM:SS'),
    end_time: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'End time must be HH:MM or HH:MM:SS'),
    is_break: z.boolean().default(false),
  }),
});

export const updatePeriodSchema = z.object({
  params: z.object({
    id: idParam,
  }),
  body: z.object({
    period_name: z.string().trim().min(1, 'Period name is required').max(50),
    period_order: z.coerce
      .number()
      .int()
      .positive('Period order must be a positive integer'),
    start_time: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Start time must be HH:MM or HH:MM:SS'),
    end_time: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'End time must be HH:MM or HH:MM:SS'),
    is_break: z.boolean().default(false),
  }),
});

export const periodIdSchema = z.object({
  params: z.object({
    id: idParam,
  }),
});

// --- Settings Validation ---
export const updateWorkingDaysSchema = z.object({
  body: z.object({
    working_days: z
      .string()
      .trim()
      .min(1, 'Working days string is required')
      .max(255)
      .refine(
        (val) => {
          const parts = val.split(',').map((p) => p.trim());
          const validDays = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ];
          return parts.every((p) => validDays.includes(p));
        },
        {
          message:
            'Working days must be a comma-separated list of valid week days',
        }
      ),
  }),
});

// --- Schedule Validation ---
export const createScheduleSchema = z.object({
  body: z.object({
    staff_id: idParam,
    period_id: idParam,
    subject_name: z.string().trim().min(1, 'Subject name is required').max(100),
    class_name: z.string().trim().min(1, 'Class name is required').max(50),
    day_of_week: dayEnum,
    room: z.string().trim().max(50).optional().nullable(),
  }),
});

export const updateScheduleSchema = z.object({
  params: z.object({
    id: idParam,
  }),
  body: z.object({
    staff_id: idParam,
    period_id: idParam,
    subject_name: z.string().trim().min(1, 'Subject name is required').max(100),
    class_name: z.string().trim().min(1, 'Class name is required').max(50),
    day_of_week: dayEnum,
    room: z.string().trim().max(50).optional().nullable(),
  }),
});

export const scheduleIdSchema = z.object({
  params: z.object({
    id: idParam,
  }),
});

// --- Bulk Schedule Validation ---
const bulkEntrySchema = z.object({
  period_id: idParam,
  subject_name: z.string().trim().min(1, 'Subject name is required').max(100),
  class_name: z.string().trim().min(1, 'Class name is required').max(50),
  day_of_week: dayEnum,
  room: z.string().trim().max(50).optional().nullable(),
});

export const bulkCreateScheduleSchema = z.object({
  body: z.object({
    staff_id: idParam,
    entries: z
      .array(bulkEntrySchema)
      .min(1, 'At least one schedule entry is required'),
  }),
});
