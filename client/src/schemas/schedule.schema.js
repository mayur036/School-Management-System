import { z } from 'zod';

const idCoercion = z
  .union([z.string(), z.number()])
  .refine((val) => val !== '' && val !== undefined && val !== null, {
    message: 'Please make a selection',
  })
  .transform((val) => Number(val))
  .refine((val) => !isNaN(val) && val > 0, {
    message: 'Must be a valid positive selection',
  });

export const periodSchema = z
  .object({
    period_name: z
      .string()
      .trim()
      .min(1, 'Period name is required')
      .max(50, 'Period name must be 50 characters or fewer'),
    period_order: z
      .union([z.string(), z.number()])
      .refine((val) => val !== '' && val !== undefined, {
        message: 'Period order is required',
      })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Period order must be a positive number',
      }),
    start_time: z
      .string()
      .trim()
      .min(1, 'Start time is required')
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Must be in HH:MM or HH:MM:SS format'),
    end_time: z
      .string()
      .trim()
      .min(1, 'End time is required')
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Must be in HH:MM or HH:MM:SS format'),
    is_break: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const [startH, startM] = data.start_time.split(':').map(Number);
      const [endH, endM] = data.end_time.split(':').map(Number);
      const startMins = startH * 60 + startM;
      const endMins = endH * 60 + endM;
      return endMins > startMins;
    },
    {
      message: 'End time must be after start time',
      path: ['end_time'],
    }
  );

export const workingDaysSchema = z.object({
  working_days: z
    .array(z.string())
    .min(1, 'At least one working day must be selected')
    .max(7, 'Cannot select more than 7 days'),
});

export const scheduleSchema = z.object({
  staff_id: idCoercion,
  period_id: idCoercion,
  subject_name: z
    .string()
    .trim()
    .min(1, 'Subject name is required')
    .max(100, 'Subject name must be 100 characters or fewer'),
  class_name: z
    .string()
    .trim()
    .min(1, 'Class name is required')
    .max(50, 'Class name must be 50 characters or fewer'),
  day_of_week: z.enum(
    [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    {
      errorMap: () => ({ message: 'Please select a day' }),
    }
  ),
  room: z
    .string()
    .trim()
    .max(50, 'Room must be 50 characters or fewer')
    .optional()
    .or(z.literal('')),
});
