import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/database";
import { Book } from "../../models/book/bookModel";

interface BookRow extends RowDataPacket {
  id: number;
  title: string;
  author: string;
  category: string | null;
  isbn: string | null;
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
  quantity: number;
}

interface UpdateBookData {
  title?: string;
  author?: string;
  category?: string;
  isbn?: string;
  quantity?: number;
}

export class BookRepository {
  async findAll(): Promise<Book[]> {
    const [rows] = await db.query<BookRow[]>("SELECT * FROM books");

    return rows.map(this.mapToBook);
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

  async create(data: CreateBookData): Promise<Book> {
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO books (title, author, category, isbn, quantity, available_quantity)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        data.title,
        data.author,
        data.category ?? null,
        data.isbn ?? null,
        data.quantity,
        data.quantity,
      ],
    );

    const createdBook = await this.findById(result.insertId);

    if (!createdBook) {
      throw new Error("Book could not be created");
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
      SET title = ?, author = ?, category = ?, isbn = ?, quantity = ?, available_quantity = ?
      WHERE id = ?
      `,
      [
        data.title ?? currentBook.title,
        data.author ?? currentBook.author,
        data.category ?? currentBook.category,
        data.isbn ?? currentBook.isbn,
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

  private mapToBook(row: BookRow): Book {
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      category: row.category,
      isbn: row.isbn,
      quantity: row.quantity,
      availableQuantity: row.available_quantity,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
