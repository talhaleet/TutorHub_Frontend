import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  comment: z
    .string()
    .min(10, 'Review comment must be at least 10 characters')
    .max(500, 'Review comment cannot exceed 500 characters'),
});
