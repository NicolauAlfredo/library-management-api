import { Router } from "express";
import { BookController } from "../../controllers/book/bookController";
import { authenticate } from "../../middlewares/auth/authMiddleware";
import { authorize } from "../../middlewares/role/roleMiddleware";
import { Role } from "../../types/role";
import { validate } from "../../middlewares/validateMiddleware";

import {
  bookParamsSchema,
  bookQuerySchema,
  createBookSchema,
  updateBookSchema,
} from "../../validations/book.validation";

const bookRoutes = Router();

const bookController = new BookController();

bookRoutes.get(
  "/",
  authenticate,
  validate(bookQuerySchema, "query"),
  bookController.findAll.bind(bookController),
);

bookRoutes.get(
  "/:id",
  authenticate,
  validate(bookParamsSchema, "params"),
  bookController.findById.bind(bookController),
);

bookRoutes.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  validate(createBookSchema, "body"),
  bookController.create.bind(bookController),
);

bookRoutes.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(bookParamsSchema, "params"),
  validate(updateBookSchema, "body"),
  bookController.update.bind(bookController),
);

bookRoutes.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(bookParamsSchema, "params"),
  bookController.delete.bind(bookController),
);

export default bookRoutes;
