import { Request, Response } from "express";
import { BookService } from "../../services/book/bookService";

export class BookController {
  private bookService = new BookService();

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const books = await this.bookService.findAll();

      res.status(200).json({
        success: true,
        data: books,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch books",
      });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const book = await this.bookService.findById(id);

      res.status(200).json({
        success: true,
        data: book,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Book not found",
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const book = await this.bookService.create(req.body);

      res.status(201).json({
        success: true,
        data: book,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create book",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const book = await this.bookService.update(id, req.body);

      res.status(200).json({
        success: true,
        data: book,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update book",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      await this.bookService.delete(id);

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete book",
      });
    }
  }
}
