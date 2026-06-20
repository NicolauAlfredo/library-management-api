import { z } from "zod";
import { Role } from "../../types/role";

export const userParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(Role).optional(),
});
