import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(80, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z
    .string()
    .min(3, 'Please enter a subject')
    .max(120, 'Subject is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long'),
});
