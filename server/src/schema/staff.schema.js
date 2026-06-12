import { z } from 'zod';

// Reusable: a positive integer route param (e.g. /staff/:id)
const idParam = z.coerce
  .number({ invalid_type_error: 'id must be a number' })
  .int('id must be an integer')
  .positive('id must be positive');

const memberSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(80),
  last_name: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().email('Invalid email address').max(150),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
  phone: z.string().trim().max(20).optional(),
});

export const createStaffSchema = z.object({
  body: z.union([
    z.object({
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
    z.object({
      department_id: idParam,
      members: z.array(memberSchema).min(1, 'At least one member is required'),
    }),
  ]),
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

export const updateProfileSchema = z.object({
  body: z.object({
    first_name: z.string().trim().min(1, 'First name is required').max(80),
    last_name: z.string().trim().min(1, 'Last name is required').max(80),
    phone: z.string().trim().max(20).optional().nullable(),
  }),
});

// Staff Activities Schemas
export const clockInOutSchema = z.object({
  body: z
    .object({
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
        .optional(),
      time: z
        .string()
        .regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format')
        .optional(),
    })
    .optional(),
});

export const leaveRequestSchema = z.object({
  body: z
    .object({
      leave_type: z.string().trim().min(1, 'Leave type is required').max(50),
      start_date: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          'Start date must be in YYYY-MM-DD format'
        ),
      end_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
      reason: z.string().trim().min(1, 'Reason is required'),
    })
    .refine(
      (data) => {
        const [year, month, day] = data.start_date.split('-').map(Number);
        const start = new Date(year, month - 1, day);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return start >= tomorrow;
      },
      {
        message:
          'Start date must be at least 1 day in advance (tomorrow or later)',
        path: ['start_date'],
      }
    )
    .refine(
      (data) => {
        const [sYear, sMonth, sDay] = data.start_date.split('-').map(Number);
        const [eYear, eMonth, eDay] = data.end_date.split('-').map(Number);
        const start = new Date(sYear, sMonth - 1, sDay);
        const end = new Date(eYear, eMonth - 1, eDay);
        return end >= start;
      },
      {
        message: 'End date must be on or after start date',
        path: ['end_date'],
      }
    ),
});

export const updateTaskStatusSchema = z.object({
  params: z.object({ id: idParam }),
  body: z.object({
    status: z.enum(['pending', 'in_progress', 'completed'], {
      errorMap: () => ({
        message: "Status must be 'pending', 'in_progress', or 'completed'",
      }),
    }),
  }),
});

// School Admin Management of Staff Schemas
export const assignTaskSchema = z.object({
  body: z.object({
    staff_id: idParam,
    title: z.string().trim().min(1, 'Title is required').max(150),
    description: z.string().trim().optional(),
    due_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
      .optional(),
  }),
});

export const reviewLeaveSchema = z.object({
  params: z.object({ id: idParam }),
  body: z.object({
    status: z.enum(['approved', 'rejected'], {
      errorMap: () => ({ message: "Status must be 'approved' or 'rejected'" }),
    }),
    comments: z.string().trim().optional().nullable(),
  }),
});

export const createScheduleSchema = z.object({
  body: z.object({
    staff_id: idParam,
    subject_name: z.string().trim().min(1, 'Subject name is required').max(100),
    class_name: z.string().trim().min(1, 'Class name is required').max(50),
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
        errorMap: () => ({ message: 'Invalid day of the week' }),
      }
    ),
    start_time: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Start time must be HH:MM or HH:MM:SS'),
    end_time: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'End time must be HH:MM or HH:MM:SS'),
    room: z.string().trim().max(50).optional().nullable(),
  }),
});
