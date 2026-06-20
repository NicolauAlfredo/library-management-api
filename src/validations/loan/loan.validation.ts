import { z } from "zod";

export const borrowBookParamsSchema = z.object({
  bookId: z.coerce.number().int().positive(),
});

export const loanParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
