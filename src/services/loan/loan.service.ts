import { AppError } from "../../errors/app-errors";
import { Loan } from "../../models/loan/loanModel";
import { BookRepository } from "../../repositories/book/book.repository";
import { LoanRepository } from "../../repositories/loan/loan.repository";
import { UserRepository } from "../../repositories/user/user.repository";
import { LoanStatus } from "../../types/loan.status";

export class LoanService {
  private loanRepository = new LoanRepository();
  private bookRepository = new BookRepository();
  private userRepository = new UserRepository();

  async borrowBook(userId: number, bookId: number): Promise<Loan> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const book = await this.bookRepository.findById(bookId);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    if (book.availableQuantity <= 0) {
      throw new AppError("Book is not available", 404);
    }

    const dueDate = this.calculateDueDate();

    const activeLoan = await this.loanRepository.findActiveLoanByUserAndBook(
      userId,
      bookId,
    );

    if (activeLoan) {
      throw new AppError("You already have an active loan for this book", 409);
    }

    const loanId = await this.loanRepository.create(userId, bookId, dueDate);

    await this.bookRepository.decreaseAvailableQuantity(bookId);

    const loan = await this.loanRepository.findById(loanId);

    if (!loan) {
      throw new AppError("Loan could not be created", 500);
    }

    return loan;
  }

  async returnBook(loanId: number, userId: number): Promise<Loan> {
    const loan = await this.loanRepository.findById(loanId);

    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    if (loan.userId !== userId) {
      throw new AppError("You cannot return another user's loan", 403);
    }

    if (loan.status === LoanStatus.RETURNED) {
      throw new AppError("Loan already returned", 409);
    }

    await this.loanRepository.returnBook(loanId);
    await this.bookRepository.increaseAvailableQuantity(loan.bookId);

    const updatedLoan = await this.loanRepository.findById(loanId);

    if (!updatedLoan) {
      throw new AppError("Loan could not be updated", 500);
    }

    return updatedLoan;
  }

  async findAll(): Promise<Loan[]> {
    return this.loanRepository.findAll();
  }

  async findMyLoans(userId: number): Promise<Loan[]> {
    return this.loanRepository.findByUser(userId);
  }

  private calculateDueDate(): Date {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    return dueDate;
  }
}
