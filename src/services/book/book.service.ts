import { Book } from "../../models/book/bookModel";
import { BookRepository } from "../../repositories/book/book.repository";
import { AppError } from "../../errors/app-errors";

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
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  available?: boolean;
}

interface PaginatedBooksResult {
  books: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class BookService {
  private bookRepository = new BookRepository();

  async findAll(params: FindAllBooksParams): Promise<PaginatedBooksResult> {
    const page = params.page && params.page > 0 ? params.page : 1;

    const limit =
      params.limit && params.limit > 0 && params.limit <= 100
        ? params.limit
        : 10;

    const { books, total } = await this.bookRepository.findAll({
      page,
      limit,
      search: params.search,
      category: params.category,
      available: params.available,
    });

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return book;
  }

  async create(data: CreateBookData): Promise<Book> {
    if (data.isbn) {
      const existingBook = await this.bookRepository.findByIsbn(data.isbn);

      if (existingBook) {
        throw new AppError("Book with this ISBN already exists", 409);
      }
    }

    return this.bookRepository.create(data);
  }

  async update(id: number, data: UpdateBookData): Promise<Book> {
    if (data.isbn) {
      const existingBook = await this.bookRepository.findByIsbn(data.isbn);

      if (existingBook && existingBook.id !== id) {
        throw new AppError("Book with this ISBN already exists", 409);
      }
    }

    const book = await this.bookRepository.update(id, data);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return book;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.bookRepository.delete(id);

    if (!deleted) {
      throw new AppError("Book not found", 404);
    }
  }
}
