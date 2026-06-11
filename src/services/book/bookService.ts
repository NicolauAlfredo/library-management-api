import { Book } from "../../models/book/bookModel";
import { BookRepository } from "../../repositories/book/bookRepository";

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

export class BookService {
  private bookRepository = new BookRepository();

  async findAll(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }

  async findById(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);

    if (!book) {
      throw new Error("Book not found");
    }

    return book;
  }

  async create(data: CreateBookData): Promise<Book> {
    this.validateCreateBookData(data);

    return this.bookRepository.create(data);
  }

  async update(id: number, data: UpdateBookData): Promise<Book> {
    const book = await this.bookRepository.update(id, data);

    if (!book) {
      throw new Error("Book not found");
    }

    return book;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.bookRepository.delete(id);

    if (!deleted) {
      throw new Error("Book not found");
    }
  }

  private validateCreateBookData(data: CreateBookData): void {
    if (!data.title || data.title.trim().length < 2) {
      throw new Error("Book title is required");
    }

    if (!data.author || data.author.trim().length < 2) {
      throw new Error("Book author is required");
    }

    if (!Number.isInteger(data.quantity) || data.quantity < 1) {
      throw new Error("Book quantity must be greater than zero");
    }
  }
}
