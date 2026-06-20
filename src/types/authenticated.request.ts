import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Role } from "./role";

export interface AuthenticatedRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: number;
    role: Role;
  };
}
