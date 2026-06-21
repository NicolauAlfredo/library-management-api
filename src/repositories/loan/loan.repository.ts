import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/database";
import { Loan } from "../../models/loan/loanModel";
import { LoanStatus } from "../../types/loan.status";

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

interface FindAllLoansParams {
  page: number;
  limit: number;
  status?: LoanStatus;
  userId?: number;
  bookId?: number;
  search?: string;
}

interface FindAllLoansResult {
  loans: Loan[];
  total: number;
}

interface FindLoansByUserParams {
  userId: number;
  page: number;
  limit: number;
  status?: LoanStatus;
  search?: string;
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

  async findAll(params: FindAllLoansParams): Promise<FindAllLoansResult> {
    const { page, limit, status, userId, bookId, search } = params;

    const offset = (page - 1) * limit;

    const conditions: string[] = [
      "users.deleted_at IS NULL",
      "books.deleted_at IS NULL",
    ];
    const values: unknown[] = [];

    if (status) {
      conditions.push("loans.status = ?");
      values.push(status);
    }

    if (userId) {
      conditions.push("loans.user_id = ?");
      values.push(userId);
    }

    if (bookId) {
      conditions.push("loans.book_id = ?");
      values.push(bookId);
    }

    if (search) {
      conditions.push(
        "(users.name LIKE ? OR users.email LIKE ? OR books.title LIKE ?)",
      );

      const searchValue = `%${search}%`;

      values.push(searchValue, searchValue, searchValue);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

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
    ${whereClause}
    ORDER BY loans.loan_date DESC
    LIMIT ? OFFSET ?
    `,
      [...values, limit, offset],
    );

    const [countRows] = await db.query<RowDataPacket[]>(
      `
    SELECT COUNT(*) AS total
    FROM loans
    INNER JOIN users ON users.id = loans.user_id
    INNER JOIN books ON books.id = loans.book_id
    ${whereClause}
    `,
      values,
    );

    return {
      loans: rows.map((loan) => ({
        id: loan.id,
        userId: loan.user_id,
        userName: loan.user_name,
        userEmail: loan.user_email,
        bookId: loan.book_id,
        bookTitle: loan.book_title,
        bookAuthor: loan.book_author,
        loanDate: loan.loan_date,
        dueDate: loan.due_date,
        returnedAt: loan.returned_at,
        status: loan.status,
      })),
      total: countRows[0].total,
    };
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

  async findByUser(params: FindLoansByUserParams): Promise<FindAllLoansResult> {
    const { userId, page, limit, status, search } = params;

    const offset = (page - 1) * limit;

    const conditions: string[] = [
      "loans.user_id = ?",
      "users.deleted_at IS NULL",
      "books.deleted_at IS NULL",
    ];

    const values: unknown[] = [userId];

    if (status) {
      conditions.push("loans.status = ?");
      values.push(status);
    }

    if (search) {
      conditions.push("(books.title LIKE ? OR books.author LIKE ?)");
      const searchValue = `%${search}%`;
      values.push(searchValue, searchValue);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

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
    ${whereClause}
    ORDER BY loans.loan_date DESC
    LIMIT ? OFFSET ?
    `,
      [...values, limit, offset],
    );

    const [countRows] = await db.query<RowDataPacket[]>(
      `
    SELECT COUNT(*) AS total
    FROM loans
    INNER JOIN users ON users.id = loans.user_id
    INNER JOIN books ON books.id = loans.book_id
    ${whereClause}
    `,
      values,
    );

    return {
      loans: rows.map((loan) => ({
        id: loan.id,
        userId: loan.user_id,
        userName: loan.user_name,
        userEmail: loan.user_email,
        bookId: loan.book_id,
        bookTitle: loan.book_title,
        bookAuthor: loan.book_author,
        loanDate: loan.loan_date,
        dueDate: loan.due_date,
        returnedAt: loan.returned_at,
        status: loan.status,
      })),
      total: Number(countRows[0].total),
    };
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

  async updateOverdueLoans(): Promise<number> {
    const [result] = await db.query<ResultSetHeader>(
      `
    UPDATE loans
    SET status = ?
    WHERE status = ?
      AND due_date < NOW()
      AND returned_at IS NULL
    `,
      [LoanStatus.LATE, LoanStatus.ACTIVE],
    );

    return result.affectedRows;
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
