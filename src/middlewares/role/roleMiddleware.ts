import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../types/authenticated.request";
import { Role } from "../../types/role";

export function authorize(...allowedRoles: Role[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });

      return;
    }

    next();
  };
}
