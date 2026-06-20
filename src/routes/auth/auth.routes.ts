import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { authenticate } from "../../middlewares/auth/auth.middleware";
import { authorize } from "../../middlewares/role/roleMiddleware";
import { Role } from "../../types/role";

const authRoutes = Router();

const authController = new AuthController();

authRoutes.post("/register", authController.register.bind(authController));

authRoutes.post("/login", authController.login.bind(authController));

authRoutes.get(
  "/profile",
  authenticate,
  authController.profile.bind(authController),
);

authRoutes.get("/admin", authenticate, authorize(Role.ADMIN), (req, res) => {
  res.json({
    success: true,
    message: "Admin area",
  });
});

export default authRoutes;
