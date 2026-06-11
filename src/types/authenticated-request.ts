import { Request } from "express";
import { Role } from "./role";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: Role;
  };
}
