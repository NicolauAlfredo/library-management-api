import { Router } from "express";
import { LoanController } from "../../controllers/loan/loan.controller";
import { authenticate } from "../../middlewares/auth/auth.middleware";
import { authorize } from "../../middlewares/role/roleMiddleware";
import { Role } from "../../types/role";

import { validate } from "../../middlewares/validate.middleware";
import {
  borrowBookParamsSchema,
  loanParamsSchema,
} from "../../validations/loan/loan.validation";

const loanRoutes = Router();

const loanController = new LoanController();

loanRoutes.get(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  loanController.findAll.bind(loanController),
);

loanRoutes.post(
  "/borrow/:bookId",
  authenticate,
  validate(borrowBookParamsSchema, "params"),
  loanController.borrowBook.bind(loanController),
);

loanRoutes.patch(
  "/:id/return",
  authenticate,
  validate(loanParamsSchema, "params"),
  loanController.returnBook.bind(loanController),
);

loanRoutes.get(
  "/my",
  authenticate,
  loanController.findMyLoans.bind(loanController),
);

export default loanRoutes;
