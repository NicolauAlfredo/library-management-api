import { Router } from "express";
import { BookController } from "../../controllers/book/bookController";
import { authenticate } from "../../middlewares/auth/authMiddleware";
import { authorize } from "../../middlewares/role/roleMiddleware";
import { Role } from "../../types/role";

const bookRoutes = Router();

const bookController = new BookController();

bookRoutes.get("/", authenticate, bookController.findAll.bind(bookController));

bookRoutes.get(
  "/:id",
  authenticate,
  bookController.findById.bind(bookController),
);

bookRoutes.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  bookController.create.bind(bookController),
);

bookRoutes.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  bookController.update.bind(bookController),
);

bookRoutes.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  bookController.delete.bind(bookController),
);

export default bookRoutes;
