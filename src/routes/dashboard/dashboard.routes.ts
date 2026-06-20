import { Router } from "express";
import { DashboardController } from "../../controllers/dashboard/dashboard.controller";
import { authenticate } from "../../middlewares/auth/auth.middleware";
import { authorize } from "../../middlewares/role/role.middleware";
import { Role } from "../../types/role";
import { asyncHandler } from "../../utils/async-handler";

const dashboardRoutes = Router();

const dashboardController = new DashboardController();

dashboardRoutes.get(
  "/admin",
  authenticate,
  authorize(Role.ADMIN),
  asyncHandler(dashboardController.getAdminStats.bind(dashboardController)),
);

export default dashboardRoutes;
