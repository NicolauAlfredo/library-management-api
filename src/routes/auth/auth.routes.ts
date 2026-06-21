import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { authenticate } from "../../middlewares/auth/auth.middleware";
import { authorize } from "../../middlewares/role/role.middleware";
import { Role } from "../../types/role";
import { validate } from "../../middlewares/validate.middleware";

import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../../validations/auth/auth.validation";
import { asyncHandler } from "../../utils/async-handler";

const authRoutes = Router();

const authController = new AuthController();

authRoutes.post(
  "/register",
  validate(registerSchema, "body"),
  asyncHandler(authController.register.bind(authController)),
);

authRoutes.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema, "body"),
  asyncHandler(authController.changePassword.bind(authController)),
);

authRoutes.post(
  "/login",
  validate(loginSchema, "body"),
  asyncHandler(authController.login.bind(authController)),
);

authRoutes.get(
  "/profile",
  authenticate,
  asyncHandler(authController.profile.bind(authController)),
);

authRoutes.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema, "body"),
  asyncHandler(authController.updateProfile.bind(authController)),
);

authRoutes.get("/admin", authenticate, authorize(Role.ADMIN), (req, res) => {
  res.json({
    success: true,
    message: "Admin area",
  });
});

export default authRoutes;
