import { Response } from "express";
import { LoanService } from "../../services/loan/loan.service";
import { AuthenticatedRequest } from "../../types/authenticated.request";
import { parseId } from "../../utils/parseId";

interface LoanParams {
  id: string;
}

interface BorrowParams {
  bookId: string;
}

export class LoanController {
  private loanService = new LoanService();

  async findAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const loans = await this.loanService.findAll();

      res.status(200).json({
        success: true,
        data: loans,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch loans",
      });
    }
  }

  async borrowBook(
    req: AuthenticatedRequest<BorrowParams>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const bookId = parseId(req.params.bookId);

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const loan = await this.loanService.borrowBook(userId, bookId);

      res.status(201).json({
        success: true,
        data: loan,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to borrow book",
      });
    }
  }

  async returnBook(
    req: AuthenticatedRequest<LoanParams>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const loanId = parseId(req.params.id);

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const loan = await this.loanService.returnBook(loanId, userId);

      res.status(200).json({
        success: true,
        data: loan,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to return book",
      });
    }
  }

  async findMyLoans(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const loans = await this.loanService.findMyLoans(userId);

      res.status(200).json({
        success: true,
        data: loans,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch loans",
      });
    }
  }
}
