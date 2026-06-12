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

// Staff Activities
export const leaveRequestSchema = z
  .object({
    leave_type: z.string().min(1, 'Please select a leave type'),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    reason: z.string().trim().min(5, 'Reason must be at least 5 characters'),
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
  );

export const assignTaskSchema = z.object({
  staff_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  title: z.string().trim().min(1, 'Title is required').max(150),
  description: z.string().trim().optional(),
  due_date: z.string().min(1, 'Due date is required'),
});

export const createScheduleSchema = z.object({
  staff_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  subject_name: z.string().trim().min(1, 'Subject is required').max(100),
  class_name: z.string().trim().min(1, 'Class is required').max(50),
  day_of_week: z.enum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  room: z.string().trim().max(50).optional().or(z.literal('')),
});

export const reviewLeaveSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    errorMap: () => ({ message: "Status must be 'approved' or 'rejected'" }),
  }),
  comments: z
    .string()
    .trim()
    .max(255, 'Comments must be 255 characters or fewer')
    .optional()
    .or(z.literal('')),
});
