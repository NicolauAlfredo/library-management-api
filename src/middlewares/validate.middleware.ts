import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function validate(
  schema: z.ZodTypeAny,
  property: "body" | "params" | "query",
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });

      return;
    }

    if (property === "body") {
      req.body = result.data;
    }

    if (property === "params") {
      req.params = result.data;
    }

    // Do not assign req.query directly.
    // In Express, req.query may be read-only.
    res.locals.query = result.data;

    next();
  };
}
