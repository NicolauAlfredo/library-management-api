import { Router } from "express";
import { LoanController } from "../../controllers/loan/loanController";
import { authenticate } from "../../middlewares/auth/authMiddleware";

const loanRoutes = Router();

const loanController = new LoanController();

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
