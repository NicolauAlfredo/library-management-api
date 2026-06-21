import { Response } from "express";
import { LoanService } from "../../services/loan/loan.service";
import { AuthenticatedRequest } from "../../types/authenticated.request";
import { parseId } from "../../utils/parse-id";
import { LoanStatus } from "../../types/loan.status";
import { AppError } from "../../errors/app-errors";

export class LoanController {
  private loanService = new LoanService();

  async findAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { page, limit, status, userId, bookId, search } = res.locals.query;

    const result = await this.loanService.findAll({
      page,
      limit,
      status,
      userId,
      bookId,
      search,
    });

    res.status(200).json({
      success: true,
      data: result.loans,
      pagination: result.pagination,
    });
  }

  async borrowBook(req: AuthenticatedRequest, res: Response): Promise<void> {
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
  }

  async returnBook(req: AuthenticatedRequest, res: Response): Promise<void> {
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
  }

  async findMyLoans(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const { page, limit, status, search } = res.locals.query;

    const result = await this.loanService.findMyLoans(userId, {
      page,
      limit,
      status,
      search,
    });

    res.status(200).json({
      success: true,
      data: result.loans,
      pagination: result.pagination,
    });
  }

  async updateOverdueLoans(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const result = await this.loanService.updateOverdueLoans();

    res.status(200).json({
      success: true,
      message: "Overdue loans updated successfully",
      data: result,
    });
  }
}
