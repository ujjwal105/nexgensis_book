export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  description: string;
  coverColor: string;
  createdAt: string;
  coverImage?: string;
};

export type BookFilters = {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
};

export type PaginatedBooks = {
  data: Book[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
};

export type BookDraft = Omit<Book, "id" | "createdAt">;
