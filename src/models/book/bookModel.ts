export interface Book {
  id: number;
  title: string;
  author: string;
  category: string | null;
  isbn: string | null;
  coverUrl: string | null;
  quantity: number;
  availableQuantity: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
