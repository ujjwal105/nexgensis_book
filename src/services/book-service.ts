import api from "@/services/api";
import type { Book, BookDraft, BookFilters, PaginatedBooks } from "@/types/book";

type FreeApiBookResponse = {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    nextPage: boolean;
    data: FreeApiBookItem[];
  };
  message: string;
  success: boolean;
};

type FreeApiSingleBookResponse = {
  statusCode: number;
  data: FreeApiBookItem;
  message: string;
  success: boolean;
};

type FreeApiBookItem = {
  id: number | string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    categories?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
};

type BookStore = {
  customBooks: Book[];
  overrides: Record<string, Book>;
  deletedIds: string[];
};

const BOOK_STORE_KEY = "nexgensis-book-store";
const coverColors = ["#6366F1", "#10B981", "#F43F5E", "#0EA5E9", "#F59E0B"];

function getFallbackStore(): BookStore {
  return {
    customBooks: [],
    overrides: {},
    deletedIds: [],
  };
}

function readStore(): BookStore {
  if (typeof window === "undefined") {
    return getFallbackStore();
  }

  const raw = window.localStorage.getItem(BOOK_STORE_KEY);

  if (!raw) {
    return getFallbackStore();
  }

  try {
    return JSON.parse(raw) as BookStore;
  } catch {
    return getFallbackStore();
  }
}

function writeStore(store: BookStore) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BOOK_STORE_KEY, JSON.stringify(store));
}

function getCoverColor(seed: string) {
  let hash = 0;

  for (const char of seed) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  return coverColors[Math.abs(hash) % coverColors.length];
}

function getPublicationYear(value?: string) {
  if (!value) {
    return new Date().getFullYear();
  }

  const match = value.match(/\d{4}/);
  return match ? Number(match[0]) : new Date().getFullYear();
}

function normalizeImageUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  return value.replace(/^http:\/\//i, "https://");
}

function normalizeBook(item: FreeApiBookItem): Book {
  const title = item.volumeInfo?.title?.trim() || "Untitled Book";
  const author = item.volumeInfo?.authors?.join(", ").trim() || "Unknown Author";
  const genre = item.volumeInfo?.categories?.[0] || "General";
  const publicationYear = getPublicationYear(item.volumeInfo?.publishedDate);
  const description =
    item.volumeInfo?.description?.trim() ||
    "No description is available for this book yet.";
  const coverImage =
    normalizeImageUrl(
      item.volumeInfo?.imageLinks?.thumbnail ||
        item.volumeInfo?.imageLinks?.smallThumbnail,
    );

  return {
    id: String(item.id),
    title,
    author,
    genre,
    publicationYear,
    description,
    coverColor: getCoverColor(`${item.id}-${title}`),
    createdAt: new Date(publicationYear, 0, 1).toISOString(),
    coverImage,
  };
}

async function fetchRemoteBooks(page: number, limit: number) {
  const response = await api.get<FreeApiBookResponse>("/public/books", {
    params: { page, limit },
  });

  return response.data.data;
}

async function fetchRemoteBook(id: string) {
  const response = await api.get<FreeApiSingleBookResponse>(`/public/books/${id}`);
  return response.data.data ? normalizeBook(response.data.data) : null;
}

function applyLocalState(remoteBooks: Book[], store: BookStore) {
  const visibleRemoteBooks = remoteBooks
    .filter((book) => !store.deletedIds.includes(book.id))
    .map((book) => store.overrides[book.id] ?? book);

  return [...store.customBooks, ...visibleRemoteBooks];
}

function filterBooks(books: Book[], filters: BookFilters) {
  const search = filters.search?.trim().toLowerCase() ?? "";
  const genre = filters.genre?.trim().toLowerCase() ?? "";

  return books.filter((book) => {
    const matchesSearch =
      !search ||
      [book.title, book.author, book.description]
        .join(" ")
        .toLowerCase()
        .includes(search);

    const matchesGenre = !genre || book.genre.toLowerCase() === genre;

    return matchesSearch && matchesGenre;
  });
}

function paginateBooks(books: Book[], page: number, limit: number): PaginatedBooks {
  const start = (page - 1) * limit;
  const data = books.slice(start, start + limit);
  const totalItems = books.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    data,
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
  };
}

export const bookService = {
  async getBooks(filters: BookFilters = {}): Promise<PaginatedBooks> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const store = readStore();

    const remotePage = await fetchRemoteBooks(1, 100);
    const remoteBooks = remotePage.data.map(normalizeBook);
    const mergedBooks = applyLocalState(remoteBooks, store);
    const filteredBooks = filterBooks(mergedBooks, filters);

    return paginateBooks(filteredBooks, page, limit);
  },

  async getBook(id: string): Promise<Book> {
    const store = readStore();
    const customBook = store.customBooks.find((book) => book.id === id);

    if (customBook) {
      return customBook;
    }

    if (store.deletedIds.includes(id)) {
      throw new Error("Book not found");
    }

    const overriddenBook = store.overrides[id];

    if (overriddenBook) {
      return overriddenBook;
    }

    const remoteBook = await fetchRemoteBook(id);

    if (!remoteBook) {
      throw new Error("Book not found");
    }

    return remoteBook;
  },

  async createBook(bookData: BookDraft): Promise<Book> {
    const store = readStore();
    const createdBook: Book = {
      ...bookData,
      id: `local-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };

    store.customBooks = [createdBook, ...store.customBooks];
    writeStore(store);

    return createdBook;
  },

  async updateBook(id: string, bookData: Partial<BookDraft>): Promise<Book> {
    const store = readStore();
    const customBookIndex = store.customBooks.findIndex((book) => book.id === id);

    if (customBookIndex >= 0) {
      const updatedBook = {
        ...store.customBooks[customBookIndex],
        ...bookData,
      };

      store.customBooks[customBookIndex] = updatedBook;
      writeStore(store);
      return updatedBook;
    }

    const baseBook = store.overrides[id] ?? (await this.getBook(id));
    const updatedBook = { ...baseBook, ...bookData };

    store.overrides[id] = updatedBook;
    writeStore(store);

    return updatedBook;
  },

  async deleteBook(id: string): Promise<void> {
    const store = readStore();

    store.customBooks = store.customBooks.filter((book) => book.id !== id);
    delete store.overrides[id];

    if (!id.startsWith("local-") && !store.deletedIds.includes(id)) {
      store.deletedIds.push(id);
    }

    writeStore(store);
  },
};
