import { Router } from "express";
import { UserController } from "../../controllers/user/userController";
import { authenticate } from "../../middlewares/auth/authMiddleware";
import { authorize } from "../../middlewares/role/roleMiddleware";
import { Role } from "../../types/role";

const userRoutes = Router();

const userController = new UserController();

userRoutes.get(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  userController.findAll.bind(userController),
);

userRoutes.get(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  userController.findById.bind(userController),
);

userRoutes.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  userController.update.bind(userController),
);

userRoutes.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  userController.delete.bind(userController),
);

export default userRoutes;
