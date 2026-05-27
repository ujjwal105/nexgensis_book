import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  LoaderCircle,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

import { BookFormModal } from "@/components/books/book-form-modal";
import { EmptyState } from "@/components/books/empty-state";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useToast } from "@/components/ui/toast-context";
import {
  useBooks,
  useCreateBook,
  useDeleteBook,
  useUpdateBook,
} from "@/hooks/use-books";
import type { Book, BookDraft } from "@/types/book";

function sortBooksByRecency(books: Book[]) {
  return [...books].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function groupBooksByGenre(books: Book[]) {
  return Object.entries(
    books.reduce<Record<string, Book[]>>((acc, book) => {
      const key = book.genre || "General";
      acc[key] = [...(acc[key] ?? []), book];
      return acc;
    }, {}),
  ).sort(([, left], [, right]) => right.length - left.length);
}

function BookCover({
  book,
  className,
  priority = false,
}: {
  book: Book;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border border-white/10 bg-black/20 shadow-[0_18px_40px_rgba(0,0,0,0.35)] ${className ?? ""}`}
      style={{ backgroundColor: book.coverColor }}
    >
      {book.coverImage ? (
        <>
          <img
            src={book.coverImage}
            alt={book.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading={priority ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-white/5" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 24%, rgba(0,0,0,0.18) 100%)",
            }}
          />
          <div className="absolute inset-y-3 left-2 w-px bg-white/25" />
        </>
      )}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/12" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="line-clamp-3 text-xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-sm">
          {book.title}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-white/72">{book.author}</p>
      </div>
    </div>
  );
}

function ShelfBook({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group block min-w-[170px] snap-start transition-transform duration-200 hover:-translate-y-1"
    >
      <BookCover book={book} className="h-[258px] w-[170px]" />
    </Link>
  );
}

function RankedBookRow({
  book,
  index,
  onDelete,
  onEdit,
}: {
  book: Book;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
}) {
  return (
    <div className="group flex items-center gap-5 border-b border-white/7 py-5 last:border-b-0">
      <span className="w-10 flex-none text-5xl font-semibold leading-none tracking-tight text-white/92">
        {index + 1}
      </span>
      <Link to={`/books/${book.id}`} className="flex flex-1 items-center gap-4">
        <BookCover book={book} className="h-24 w-18 flex-none rounded-[16px]" />
        <div className="min-w-0">
          <p className="truncate text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-sky-200">
            {book.title}
          </p>
          <p className="mt-1 truncate text-sm text-white/58">{book.author}</p>
        </div>
      </Link>
      <div className="hidden items-center gap-2 xl:flex">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-white/10 bg-white/4 px-3 text-white/72 hover:bg-white/10 hover:text-white"
          onClick={() => onEdit(book)}
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-white/10 bg-white/4 px-3 text-white/72 hover:bg-rose-500/18 hover:text-rose-200"
          onClick={() => onDelete(book.id)}
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">
          {eyebrow}
        </p>
      ) : null}
      <div className="mt-1 flex items-center gap-2">
        <h2 className="text-[2.35rem] font-semibold tracking-tight text-white">{title}</h2>
        <ChevronRight className="mt-1 size-8 text-white/35" />
      </div>
    </div>
  );
}

export function BooksPage() {
  const [params, setParams] = useSearchParams();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();
  const { data, error, isError, isFetching, isLoading, refetch } = useBooks({
    page: 1,
    limit: 100,
  });
  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();
  const isCreateRequested = params.get("create") === "true";
  const isModalOpen = Boolean(selectedBook) || isCreateRequested;
  const books = useMemo(() => sortBooksByRecency(data?.data ?? []), [data?.data]);

  const featuredBooks = books.slice(0, 3);
  const rankedBooks = books.slice(0, 6);
  const genreShelves = useMemo(() => groupBooksByGenre(books).slice(0, 4), [books]);
  const curatedShelf = books.slice(3, 9);
  const fictionShelf = genreShelves.find(([genre]) => genre.toLowerCase().includes("fiction"));
  const libraryShelf = fictionShelf?.[1] ?? curatedShelf;

  const clearCreateParam = () => {
    const nextParams = new URLSearchParams(params);
    nextParams.delete("create");
    setParams(nextParams);
  };

  const openCreateModal = () => {
    setSelectedBook(null);
    const nextParams = new URLSearchParams(params);
    nextParams.set("create", "true");
    setParams(nextParams);
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    if (isCreateRequested) clearCreateParam();
  };

  const closeModal = () => {
    setSelectedBook(null);
    if (isCreateRequested) clearCreateParam();
  };

  const handleSubmit = async (formData: BookDraft) => {
    try {
      if (selectedBook) {
        await updateBookMutation.mutateAsync({ id: selectedBook.id, bookData: formData });
        toast({ title: "Book updated!", variant: "success" });
        return;
      }

      await createBookMutation.mutateAsync(formData);
      toast({ title: "Book added!", variant: "success" });
    } catch (err) {
      toast({
        description: err instanceof Error ? err.message : "Please try again.",
        title: "Failed to save book.",
        variant: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBookMutation.mutateAsync(id);
      toast({ title: "Book deleted!", variant: "success" });
    } catch (deleteError) {
      toast({
        description:
          deleteError instanceof Error ? deleteError.message : "Please try again.",
        title: "Failed to delete book.",
        variant: "error",
      });
    }
  };

  if (isError) {
    return (
      <div className="space-y-5">
        <ErrorBanner
          message={error instanceof Error ? error.message : "Unable to load books."}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  if (!isLoading && books.length === 0) {
    return <EmptyState hasFilters={false} onAction={openCreateModal} />;
  }

  return (
    <>
      <div className="-mx-5 -mt-5 overflow-hidden rounded-none bg-[#1c1c1d] text-white shadow-[0_40px_120px_rgba(0,0,0,0.45)] md:-mx-6 md:-mt-6 md:rounded-[34px] md:border md:border-white/6">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_26%),linear-gradient(180deg,#232324_0%,#1c1c1d_46%,#1d1d1e_100%)]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/6 to-transparent" />

          <div className="relative px-6 pb-20 pt-8 md:px-10 md:pt-10">
            <div className="mb-12 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/52">
                  Featured Collection
                </p>
                <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white md:text-6xl">
                  Book Store
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {isFetching && !isLoading ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72">
                    <LoaderCircle className="size-4 animate-spin" />
                    Refreshing
                  </span>
                ) : null}
                <Button
                  size="sm"
                  className="rounded-full border border-white/10 bg-white/10 px-4 text-white hover:bg-white/16"
                  onClick={openCreateModal}
                >
                  <Plus className="size-3.5" />
                  Add Book
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[430px] animate-pulse rounded-[30px] bg-white/6"
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 xl:grid-cols-3">
                {featuredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.04 }}
                  >
                    <div className="mb-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/68">
                        Featured Collection
                      </p>
                      <h2 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                        {book.genre}
                      </h2>
                    </div>
                    <Link to={`/books/${book.id}`} className="block">
                      <BookCover book={book} className="h-[430px] w-full" priority={index === 0} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="relative border-t border-white/5 bg-white/[0.02] px-6 py-14 md:px-10">
            <SectionHeading title={libraryShelf.length ? "Fiction & Literature" : "Curated Shelf"} />
            <div className="flex snap-x gap-6 overflow-x-auto pb-2">
              {libraryShelf.map((book) => (
                <ShelfBook key={book.id} book={book} />
              ))}
            </div>
          </div>

          <div className="relative border-t border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] px-6 py-14 md:px-10">
            <SectionHeading title="Top Free" />
            <div className="grid gap-x-12 xl:grid-cols-2">
              {rankedBooks.map((book, index) => (
                <RankedBookRow
                  key={book.id}
                  book={book}
                  index={index}
                  onDelete={(id) => void handleDelete(id)}
                  onEdit={openEditModal}
                />
              ))}
            </div>
          </div>

          {genreShelves.map(([genre, shelfBooks], sectionIndex) => (
            <div
              key={genre}
              className="relative border-t border-white/5 bg-white/[0.015] px-6 py-14 md:px-10"
            >
              <SectionHeading title={genre} />
              <div className="flex snap-x gap-6 overflow-x-auto pb-2">
                {shelfBooks.slice(0, 8).map((book) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: sectionIndex * 0.02 }}
                  >
                    <ShelfBook book={book} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          <div className="relative border-t border-white/5 bg-[#1a1a1b] px-6 py-14 md:px-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/68">
                  <Sparkles className="size-4 text-sky-300" />
                  Manage Collection
                </p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white">
                  Your Library Desk
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-white/52">
                Keep the Apple Books style storefront, but retain direct edit and delete
                controls for your catalog.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {books.slice(0, 6).map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 rounded-[24px] border border-white/8 bg-white/4 p-4"
                >
                  <BookCover book={book} className="h-28 w-20 flex-none rounded-[16px]" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/books/${book.id}`}>
                      <p className="line-clamp-2 text-xl font-semibold tracking-tight text-white">
                        {book.title}
                      </p>
                    </Link>
                    <p className="mt-1 truncate text-sm text-white/58">{book.author}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                      {book.genre}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full border border-white/10 bg-white/6 px-3 text-white/72 hover:bg-white/12 hover:text-white"
                      onClick={() => openEditModal(book)}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full border border-white/10 bg-white/6 px-3 text-white/72 hover:bg-rose-500/18 hover:text-rose-200"
                      onClick={() => void handleDelete(book.id)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BookFormModal
        book={selectedBook}
        isOpen={isModalOpen}
        isLoading={createBookMutation.isPending || updateBookMutation.isPending}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
