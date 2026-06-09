import { LoanStatus } from "../../types/loanStatus";

export interface Loan {
  id: number;
  userId: number;
  bookId: number;
  loanDate: Date;
  dueDate: Date;
  returnedAt: Date | null;
  status: LoanStatus;
}
