import { Router } from "express";
import { LoanController } from "../../controllers/loan/loanController";
import { authenticate } from "../../middlewares/auth/authMiddleware";
import { authorize } from "../../middlewares/role/roleMiddleware";
import { Role } from "../../types/role";

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
  loanController.borrowBook.bind(loanController),
);

loanRoutes.patch(
  "/:id/return",
  authenticate,
  loanController.returnBook.bind(loanController),
);

loanRoutes.get(
  "/my",
  authenticate,
  loanController.findMyLoans.bind(loanController),
);

export default loanRoutes;
