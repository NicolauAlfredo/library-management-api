import { Request } from "express";
import { Role } from "./role";

export interface AuthenticatedRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: number;
    role: Role;
  };
}
