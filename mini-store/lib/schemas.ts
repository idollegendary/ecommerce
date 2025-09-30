import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(3),
  password: z.string().min(6),
});

export const productFilterSchema = z.object({
  q: z.string().optional(),
  category: z.union([z.string(), z.number()]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  sort: z.enum(["price_asc", "price_desc", "rating", "popular"]).optional(),
  page: z.coerce.number().min(0).optional(),
  size: z.coerce.number().min(1).max(100).optional(),
});

