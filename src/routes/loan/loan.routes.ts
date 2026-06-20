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
import { asyncHandler } from "../../utils/async-handler";

const loanRoutes = Router();

const loanController = new LoanController();

loanRoutes.get(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  asyncHandler(loanController.findAll.bind(loanController)),
);

loanRoutes.post(
  "/borrow/:bookId",
  authenticate,
  validate(borrowBookParamsSchema, "params"),
  asyncHandler(loanController.borrowBook.bind(loanController)),
);

loanRoutes.patch(
  "/:id/return",
  authenticate,
  validate(loanParamsSchema, "params"),
  asyncHandler(loanController.returnBook.bind(loanController)),
);

loanRoutes.get(
  "/my",
  authenticate,
  asyncHandler(loanController.findMyLoans.bind(loanController)),
);

export default loanRoutes;
