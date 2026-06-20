import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller";
import { authenticate } from "../../middlewares/auth/auth.middleware";
import { authorize } from "../../middlewares/role/roleMiddleware";
import { Role } from "../../types/role";
import { validate } from "../../middlewares/validate.middleware";
import {
  userParamsSchema,
  updateUserSchema,
} from "../../validations/user/user.validation";
import { asyncHandler } from "../../utils/async-handler";

const userRoutes = Router();

const userController = new UserController();

userRoutes.get(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  asyncHandler(userController.findAll.bind(userController)),
);

userRoutes.get(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(userParamsSchema, "params"),
  asyncHandler(userController.findById.bind(userController)),
);

userRoutes.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(userParamsSchema, "params"),
  validate(updateUserSchema, "body"),
  asyncHandler(userController.update.bind(userController)),
);

userRoutes.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(userParamsSchema, "params"),
  asyncHandler(userController.delete.bind(userController)),
);

export default userRoutes;
