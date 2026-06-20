import { Router } from "express";
import { BookController } from "../../controllers/book/book.controller";
import { authenticate } from "../../middlewares/auth/auth.middleware";
import { authorize } from "../../middlewares/role/role.middleware";
import { Role } from "../../types/role";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";

import {
  bookParamsSchema,
  bookQuerySchema,
  createBookSchema,
  updateBookSchema,
} from "../../validations/book/book.validation";

const bookRoutes = Router();

const bookController = new BookController();

bookRoutes.get(
  "/",
  authenticate,
  validate(bookQuerySchema, "query"),
  asyncHandler(bookController.findAll.bind(bookController)),
);

bookRoutes.get(
  "/:id",
  authenticate,
  validate(bookParamsSchema, "params"),
  asyncHandler(bookController.findById.bind(bookController)),
);

bookRoutes.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  validate(createBookSchema, "body"),
  asyncHandler(bookController.create.bind(bookController)),
);

bookRoutes.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(bookParamsSchema, "params"),
  validate(updateBookSchema, "body"),
  asyncHandler(bookController.update.bind(bookController)),
);

bookRoutes.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(bookParamsSchema, "params"),
  asyncHandler(bookController.delete.bind(bookController)),
);

export default bookRoutes;
