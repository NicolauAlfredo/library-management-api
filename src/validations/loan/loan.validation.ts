import { z } from "zod";
import { LoanStatus } from "../../types/loan.status";

export const borrowBookParamsSchema = z.object({
  bookId: z.coerce.number().int().positive(),
});

export const loanParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const loanQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  status: z.nativeEnum(LoanStatus).optional(),
  userId: z.coerce.number().int().positive().optional(),
  bookId: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
});

export const myLoansQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
