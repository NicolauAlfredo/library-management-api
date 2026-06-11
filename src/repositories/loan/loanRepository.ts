import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/database";
import { Loan } from "../../models/loan/loanModel";
import { LoanStatus } from "../../types/loanStatus";

interface LoanRow extends RowDataPacket {
  id: number;
  user_id: number;
  book_id: number;
  loan_date: Date;
  due_date: Date;
  returned_at: Date | null;
  status: LoanStatus;
}

interface LoanWithDetailsRow extends RowDataPacket {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  book_id: number;
  book_title: string;
  book_author: string;
  loan_date: Date;
  due_date: Date;
  returned_at: Date | null;
  status: LoanStatus;
}

export class LoanRepository {
  async create(userId: number, bookId: number, dueDate: Date): Promise<number> {
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO loans (
        user_id,
        book_id,
        due_date
      )
      VALUES (?, ?, ?)
      `,
      [userId, bookId, dueDate],
    );

    return result.insertId;
  }

  async findAll() {
    const [rows] = await db.query<LoanWithDetailsRow[]>(
      `
    SELECT
      loans.id,
      loans.user_id,
      users.name AS user_name,
      users.email AS user_email,
      loans.book_id,
      books.title AS book_title,
      books.author AS book_author,
      loans.loan_date,
      loans.due_date,
      loans.returned_at,
      loans.status
    FROM loans
    INNER JOIN users ON users.id = loans.user_id
    INNER JOIN books ON books.id = loans.book_id
    ORDER BY loans.loan_date DESC
    `,
    );

    return rows.map((loan) => this.mapToLoan(loan));
  }

  async findById(id: number): Promise<Loan | null> {
    const [rows] = await db.query<LoanRow[]>(
      "SELECT * FROM loans WHERE id = ?",
      [id],
    );

    const loan = rows[0];

    if (!loan) {
      return null;
    }

    return this.mapToLoan(loan);
  }

  async findByUser(userId: number): Promise<Loan[]> {
    const [rows] = await db.query<LoanRow[]>(
      "SELECT * FROM loans WHERE user_id = ?",
      [userId],
    );

    return rows.map((loan) => ({
      id: loan.id,
      userId: loan.user_id,
      bookId: loan.book_id,
      loanDate: loan.loan_date,
      dueDate: loan.due_date,
      returnedAt: loan.returned_at,
      status: loan.status,
    }));
  }

  async returnBook(id: number): Promise<void> {
    await db.query(
      `
      UPDATE loans
      SET
        status = ?,
        returned_at = NOW()
      WHERE id = ?
      `,
      [LoanStatus.RETURNED, id],
    );
  }

  async findActiveLoanByUserAndBook(
    userId: number,
    bookId: number,
  ): Promise<Loan | null> {
    const [rows] = await db.query<LoanRow[]>(
      `
    SELECT *
    FROM loans
    WHERE user_id = ?
      AND book_id = ?
      AND status = ?
    LIMIT 1
    `,
      [userId, bookId, LoanStatus.ACTIVE],
    );

    const loan = rows[0];

    if (!loan) {
      return null;
    }

    return this.mapToLoan(loan);
  }

  private mapToLoan(loan: LoanRow): Loan {
    return {
      id: loan.id,
      userId: loan.user_id,
      bookId: loan.book_id,
      loanDate: loan.loan_date,
      dueDate: loan.due_date,
      returnedAt: loan.returned_at,
      status: loan.status,
    };
  }
}
