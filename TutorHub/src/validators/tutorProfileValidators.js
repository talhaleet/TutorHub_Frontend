import { z } from 'zod';

export const tutorProfileSchema = z.object({
  headline: z
    .string()
    .min(10, 'Headline must be at least 10 characters')
    .max(100, 'Headline cannot exceed 100 characters'),
  bio: z
    .string()
    .min(50, 'Biography must be at least 50 characters')
    .max(1000, 'Biography cannot exceed 1000 characters'),
  city: z.string().min(2, 'City is required'),
  hourlyRateMin: z.coerce.number().min(100, 'Hourly rate must be at least PKR 100'),
  hourlyRateMax: z.coerce.number().min(100, 'Hourly rate must be at least PKR 100'),
  experienceYears: z.coerce
    .number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years'),
}).refine((data) => data.hourlyRateMax >= data.hourlyRateMin, {
  message: 'Maximum rate must be greater than or equal to minimum rate',
  path: ['hourlyRateMax'],
});
