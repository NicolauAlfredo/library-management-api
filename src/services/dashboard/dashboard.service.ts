import { DashboardRepository } from "../../repositories/dashboard/dashboard.repository";

export class DashboardService {
  private dashboardRepository = new DashboardRepository();

  async getAdminStats() {
    return this.dashboardRepository.getAdminStats();
  }
}
