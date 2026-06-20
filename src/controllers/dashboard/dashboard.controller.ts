import { Request, Response } from "express";
import { DashboardService } from "../../services/dashboard/dashboard.service";

export class DashboardController {
  private dashboardService = new DashboardService();

  async getAdminStats(req: Request, res: Response): Promise<void> {
    const stats = await this.dashboardService.getAdminStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  }
}
