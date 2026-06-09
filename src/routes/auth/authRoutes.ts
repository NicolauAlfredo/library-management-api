import { Router } from "express";
import { AuthController } from "../../controllers/auth/authController";

const authRoutes = Router();

const authController = new AuthController();

authRoutes.post("/register", authController.register.bind(authController));

authRoutes.post("/login", authController.login.bind(authController));

export default authRoutes;
