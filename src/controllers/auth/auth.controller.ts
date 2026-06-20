import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service";
import { AuthenticatedRequest } from "../../types/authenticated.request";

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response): Promise<void> {
    const result = await this.authService.register(req.body);

    res.status(201).json({
      success: true,
      data: result,
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
