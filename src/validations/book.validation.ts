import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  category: z.string().optional(),
  coverUrl: z.string().url().optional(),
  isbn: z.string().optional(),
  quantity: z.number().int().positive(),
});

export const updateBookSchema = createBookSchema.partial();

export const bookParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const bookQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  available: z.coerce.boolean().optional(),
});
