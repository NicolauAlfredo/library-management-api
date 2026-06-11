import { Router } from "express";
import { AuthController } from "../../controllers/auth/authController";
import { authenticate } from "../../middlewares/auth/authMiddleware";

const authRoutes = Router();

const authController = new AuthController();

authRoutes.post("/register", authController.register.bind(authController));

authRoutes.post("/login", authController.login.bind(authController));

authRoutes.get(
  "/profile",
  authenticate,
  authController.profile.bind(authController),
);

export default authRoutes;
