import { z } from 'zod';

export const bookingSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  date: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please select a time slot'),
  duration: z.coerce
    .number()
    .min(1, 'Duration must be at least 1 hour')
    .max(8, 'Duration cannot exceed 8 hours'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});
