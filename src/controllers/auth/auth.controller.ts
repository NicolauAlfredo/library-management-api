import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service";
import { AuthenticatedRequest } from "../../types/authenticated.request";

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.register(req.body);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.login(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  }

  async profile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
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
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "User not found",
      });
    }
  }
}
