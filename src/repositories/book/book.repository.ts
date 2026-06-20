import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/database";
import { Book } from "../../models/book/bookModel";
import { AppError } from "../../errors/app-errors";

interface BookRow extends RowDataPacket {
  id: number;
  title: string;
  author: string;
  category: string | null;
  isbn: string | null;
  cover_url: string | null;
  quantity: number;
  available_quantity: number;
  created_at: Date;
  updated_at: Date;
}

interface CreateBookData {
  title: string;
  author: string;
  category?: string;
  isbn?: string;
  coverUrl?: string;
  quantity: number;
}

interface UpdateBookData {
  title?: string;
  author?: string;
  category?: string;
  isbn?: string;
  coverUrl?: string;
  quantity?: number;
}

interface FindAllBooksParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  available?: boolean;
}

interface FindAllBooksResult {
  books: Book[];
  total: number;
}

export class BookRepository {
  async findAll(params: FindAllBooksParams): Promise<FindAllBooksResult> {
    const { page, limit, search, category, available } = params;

    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: unknown[] = [];

    if (search) {
      conditions.push("(title LIKE ? OR author LIKE ? OR isbn LIKE ?)");

      const searchValue = `%${search}%`;

      values.push(searchValue, searchValue, searchValue);
    }

    if (category) {
      conditions.push("category = ?");
      values.push(category);
    }

    if (available !== undefined) {
      conditions.push(
        available ? "available_quantity > 0" : "available_quantity = 0",
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await db.query<BookRow[]>(
      `
    SELECT *
    FROM books
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
    `,
      [...values, limit, offset],
    );

    const [countRows] = await db.query<RowDataPacket[]>(
      `
    SELECT COUNT(*) AS total
    FROM books
    ${whereClause}
    `,
      values,
    );

    return {
      books: rows.map((book) => this.mapToBook(book)),
      total: countRows[0].total,
    };
  }

  async findById(id: number): Promise<Book | null> {
    const [rows] = await db.query<BookRow[]>(
      "SELECT * FROM books WHERE id = ? LIMIT 1",
      [id],
    );

    const book = rows[0];

    if (!book) {
      return null;
    }

    return this.mapToBook(book);
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    const [rows] = await db.query<BookRow[]>(
      "SELECT * FROM books WHERE isbn = ? LIMIT 1",
      [isbn],
    );

    const book = rows[0];

    if (!book) {
      return null;
    }

    return this.mapToBook(book);
  }

  async create(data: CreateBookData): Promise<Book> {
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO books (title, author, category, isbn, cover_url, quantity, available_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.title,
        data.author,
        data.category ?? null,
        data.isbn ?? null,
        data.coverUrl ?? null,
        data.quantity,
        data.quantity,
      ],
    );

    const createdBook = await this.findById(result.insertId);

    if (!createdBook) {
      throw new AppError("Book could not be created", 500);
    }

    return createdBook;
  }

  async update(id: number, data: UpdateBookData): Promise<Book | null> {
    const currentBook = await this.findById(id);

    if (!currentBook) {
      return null;
    }

    const quantity = data.quantity ?? currentBook.quantity;

    const availableQuantity =
      data.quantity !== undefined
        ? Math.max(
            0,
            currentBook.availableQuantity +
              (data.quantity - currentBook.quantity),
          )
        : currentBook.availableQuantity;

    await db.query(
      `
      UPDATE books
      SET title = ?, author = ?, category = ?, isbn = ?, cover_url = ?, quantity = ?, available_quantity = ?
      WHERE id = ?
      `,
      [
        data.title ?? currentBook.title,
        data.author ?? currentBook.author,
        data.category ?? currentBook.category,
        data.isbn ?? currentBook.isbn,
        data.coverUrl ?? currentBook.coverUrl,
        quantity,
        availableQuantity,
        id,
      ],
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM books WHERE id = ?",
      [id],
    );

    return result.affectedRows > 0;
  }

  async decreaseAvailableQuantity(bookId: number): Promise<void> {
    await db.query(
      `
    UPDATE books
    SET available_quantity = available_quantity - 1
    WHERE id = ? AND available_quantity > 0
    `,
      [bookId],
    );
  }

  async increaseAvailableQuantity(bookId: number): Promise<void> {
    await db.query(
      `
    UPDATE books
    SET available_quantity = available_quantity + 1
    WHERE id = ?
    `,
      [bookId],
    );
  }

  private mapToBook(row: BookRow): Book {
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      category: row.category,
      isbn: row.isbn,
      coverUrl: row.cover_url,
      quantity: row.quantity,
      availableQuantity: row.available_quantity,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
