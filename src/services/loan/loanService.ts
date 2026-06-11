import { Loan } from "../../models/loan/loanModel";
import { BookRepository } from "../../repositories/book/bookRepository";
import { LoanRepository } from "../../repositories/loan/loanRepository";
import { UserRepository } from "../../repositories/user/userRepository";
import { LoanStatus } from "../../types/loanStatus";

export class LoanService {
  private loanRepository = new LoanRepository();
  private bookRepository = new BookRepository();
  private userRepository = new UserRepository();

  async borrowBook(userId: number, bookId: number): Promise<Loan> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const book = await this.bookRepository.findById(bookId);

    if (!book) {
      throw new Error("Book not found");
    }

    if (book.availableQuantity <= 0) {
      throw new Error("Book is not available");
    }

    const dueDate = this.calculateDueDate();

    const loanId = await this.loanRepository.create(userId, bookId, dueDate);

    await this.bookRepository.decreaseAvailableQuantity(bookId);

    const loan = await this.loanRepository.findById(loanId);

    if (!loan) {
      throw new Error("Loan could not be created");
    }

    return loan;
  }

  async returnBook(loanId: number, userId: number): Promise<Loan> {
    const loan = await this.loanRepository.findById(loanId);

    if (!loan) {
      throw new Error("Loan not found");
    }

    if (loan.userId !== userId) {
      throw new Error("You cannot return another user's loan");
    }

    if (loan.status === LoanStatus.RETURNED) {
      throw new Error("Loan already returned");
    }

    await this.loanRepository.returnBook(loanId);
    await this.bookRepository.increaseAvailableQuantity(loan.bookId);

    const updatedLoan = await this.loanRepository.findById(loanId);

    if (!updatedLoan) {
      throw new Error("Loan could not be updated");
    }

    return updatedLoan;
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
