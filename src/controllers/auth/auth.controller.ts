import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service";
import { AuthenticatedRequest } from "../../types/authenticated.request";
import { AppError } from "../../errors/app-errors";

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response): Promise<void> {
    const result = await this.authService.register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const user = await this.authService.updateProfile(userId, req.body);

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const result = await this.authService.login(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  async profile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const profile = await this.authService.getProfile(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  }
}
