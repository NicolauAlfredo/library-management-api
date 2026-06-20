import { NextFunction, Request, RequestHandler, Response } from "express";

export function asyncHandler(controller: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
}
