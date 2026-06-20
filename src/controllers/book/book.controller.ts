import { Request, Response } from "express";
import { BookService } from "../../services/book/book.service";
import { parseId } from "../../utils/parse-id";

interface CreateBookBody {
  title: string;
  author: string;
  category?: string;
  coverUrl?: string;
  isbn?: string;
  quantity: number;
}

interface UpdateBookBody {
  title?: string;
  author?: string;
  category?: string;
  coverUrl?: string;
  isbn?: string;
  quantity?: number;
}

export class BookController {
  private bookService = new BookService();

  async findAll(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;

    const available =
      req.query.available === "true"
        ? true
        : req.query.available === "false"
          ? false
          : undefined;

    const result = await this.bookService.findAll({
      page,
      limit,
      search,
      category,
      available,
    });

    res.status(200).json({
      success: true,
      data: result.books,
      pagination: result.pagination,
    });
  }

  async findById(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    const book = await this.bookService.findById(id);

    res.status(200).json({
      success: true,
      data: book,
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    const book = await this.bookService.create(req.body);

    res.status(201).json({
      success: true,
      data: book,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    const book = await this.bookService.update(id, req.body);

    res.status(200).json({
      success: true,
      data: book,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);

    await this.bookService.delete(id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  }
}
