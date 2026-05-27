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

/* ─── helpers ─────────────────────────────────────────────────── */

function sortBooksByRecency(books: Book[]) {
  return [...books].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function groupBooksByGenre(books: Book[]) {
  return Object.entries(
    books.reduce<Record<string, Book[]>>((acc, book) => {
      const key = book.genre || "General";
      acc[key] = [...(acc[key] ?? []), book];
      return acc;
    }, {}),
  ).sort(([, l], [, r]) => r.length - l.length);
}

/* ─── BookCover ─────────────────────────────────────────────────── */

function BookCover({
  book,
  className,
  priority = false,
  showText = true,
}: {
  book: Book;
  className?: string;
  priority?: boolean;
  showText?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[18px] border border-black/10 dark:border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.28)] ${className ?? ""}`}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0.03) 24%,rgba(0,0,0,0.18) 100%)",
            }}
          />
          <div className="absolute inset-y-3 left-2 w-px bg-white/25" />
        </>
      )}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      {showText && (
        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <p className="line-clamp-2 text-[0.92rem] font-semibold leading-snug tracking-tight text-white drop-shadow">
            {book.title}
          </p>
          <p className="mt-1 line-clamp-1 text-[0.75rem] text-white/70">{book.author}</p>
        </div>
      )}
    </div>
  );
}

/* ─── ShelfBook (horizontal scroll card) ───────────────────────── */

function ShelfBook({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group block min-w-[150px] snap-start transition-transform duration-200 hover:-translate-y-1"
    >
      <BookCover book={book} className="h-[228px] w-[150px]" />
    </Link>
  );
}

/* ─── RankedBookRow ─────────────────────────────────────────────── */

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
    <div className="group flex items-center gap-4 border-b border-slate-100 dark:border-white/6 py-3.5 last:border-b-0">
      {/* Rank number — matches Apple Books: compact, muted */}
      <span className="w-7 flex-none text-[1.4rem] font-semibold leading-none tracking-tight text-slate-300 dark:text-white/40">
        {index + 1}
      </span>

      <Link to={`/books/${book.id}`} className="flex flex-1 items-center gap-3 min-w-0">
        <BookCover book={book} className="h-[60px] w-[44px] flex-none rounded-[10px]" showText={false} />
        <div className="min-w-0">
          <p className="truncate text-[0.92rem] font-semibold tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-sky-300">
            {book.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-white/50">{book.author}</p>
        </div>
      </Link>

      <div className="hidden items-center gap-1.5 md:flex">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/4 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          onClick={() => onEdit(book)}
        >
          <Pencil className="size-3" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:bg-white/4 dark:text-white/70 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
          onClick={() => onDelete(book.id)}
        >
          <Trash2 className="size-3" />
          Delete
        </Button>
      </div>
    </div>
  );
}

/* ─── SectionHeading ────────────────────────────────────────────── */
// Apple Books: ~20–22 px semibold/bold — NOT 37 px

function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-white/52">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex items-center gap-1.5">
        <h2 className="text-[1.2rem] font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <ChevronRight className="size-4 text-slate-400 dark:text-white/35" />
      </div>
    </div>
  );
}

/* ─── BooksPage ─────────────────────────────────────────────────── */

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
  const fictionShelf = genreShelves.find(([g]) => g.toLowerCase().includes("fiction"));
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
      <ErrorBanner
        message={error instanceof Error ? error.message : "Unable to load books."}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!isLoading && books.length === 0) {
    return <EmptyState hasFilters={false} onAction={openCreateModal} />;
  }

  return (
    <>
      {/*
       * Canvas — stretches edge-to-edge inside the page padding.
       * Light: white / near-white sections
       * Dark : Apple Books charcoal palette
       */}
      <div className="-mx-5 -mt-5 overflow-hidden bg-white dark:bg-[#1c1c1d] md:-mx-6 md:-mt-6 md:rounded-[28px] md:border md:border-slate-200/60 dark:md:border-white/6 shadow-sm">

        {/* ── Hero / Featured ── */}
        <div className="relative overflow-hidden bg-slate-50 dark:bg-[#232324]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.06),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.07),transparent_26%)]" />

          <div className="relative px-6 pb-14 pt-7 md:px-10 md:pt-9">
            {/* Hero header */}
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-white/50">
                  Featured Collection
                </p>
                <h1 className="mt-1.5 text-[2.2rem] font-bold tracking-tight text-slate-900 dark:text-white md:text-[2.8rem]">
                  Book Store
                </h1>
              </div>

              <div className="flex items-center gap-2.5">
                {isFetching && !isLoading ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-white/60">
                    <LoaderCircle className="size-3.5 animate-spin" />
                    Refreshing
                  </span>
                ) : null}
                <Button
                  size="sm"
                  className="rounded-full border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/8 dark:text-white dark:hover:bg-white/14"
                  onClick={openCreateModal}
                >
                  <Plus className="size-3.5" />
                  Add Book
                </Button>
              </div>
            </div>

            {/* Featured grid */}
            {isLoading ? (
              <div className="grid gap-5 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[360px] animate-pulse rounded-[18px] bg-slate-200 dark:bg-white/6" />
                ))}
              </div>
            ) : (
              <div className="grid gap-5 xl:grid-cols-3">
                {featuredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                  >
                    <div className="mb-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-white/55">
                        Featured Collection
                      </p>
                      <h2 className="mt-0.5 text-[1.05rem] font-bold tracking-tight text-slate-800 dark:text-white">
                        {book.genre}
                      </h2>
                    </div>
                    <Link to={`/books/${book.id}`} className="block">
                      <BookCover book={book} className="h-[360px] w-full" priority={index === 0} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Fiction shelf ── */}
        <div className="border-t border-slate-100 dark:border-white/5 px-6 py-10 md:px-10">
          <SectionHeading title={libraryShelf.length ? "Fiction & Literature" : "Curated Shelf"} />
          <div className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {libraryShelf.map((book) => (
              <ShelfBook key={book.id} book={book} />
            ))}
          </div>
        </div>

        {/* ── Top Free (ranked) ── */}
        <div className="border-t border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.018] px-6 py-10 md:px-10">
          <SectionHeading title="Top Free" />
          <div className="grid gap-x-10 xl:grid-cols-2">
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

        {/* ── Genre shelves ── */}
        {genreShelves.map(([genre, shelfBooks], si) => (
          <div
            key={genre}
            className="border-t border-slate-100 dark:border-white/5 px-6 py-10 md:px-10"
          >
            <SectionHeading title={genre} />
            <div className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {shelfBooks.slice(0, 8).map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: si * 0.02 }}
                >
                  <ShelfBook book={book} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* ── Library Desk (manage) ── */}
        <div className="border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#1a1a1b] px-6 py-10 md:px-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-white/55">
                <Sparkles className="size-3.5 text-indigo-400 dark:text-sky-400" />
                Manage Collection
              </p>
              <h2 className="mt-1 text-[1.35rem] font-bold tracking-tight text-slate-900 dark:text-white">
                Your Library Desk
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400 dark:text-white/45">
              Browse your full catalog with direct edit and delete controls.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {books.slice(0, 6).map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-4 rounded-[16px] border border-slate-200 bg-white p-3.5 dark:border-white/8 dark:bg-white/4"
              >
                <BookCover book={book} className="h-[72px] w-[52px] flex-none rounded-[10px]" showText={false} />
                <div className="min-w-0 flex-1">
                  <Link to={`/books/${book.id}`}>
                    <p className="line-clamp-2 text-[0.88rem] font-semibold leading-snug tracking-tight text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-sky-300 transition-colors">
                      {book.title}
                    </p>
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-white/50">
                    {book.author}
                  </p>
                  <p className="mt-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-slate-300 dark:text-white/35">
                    {book.genre}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/12 dark:hover:text-white"
                    onClick={() => openEditModal(book)}
                  >
                    <Pencil className="size-3" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:bg-white/6 dark:text-white/70 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
                    onClick={() => void handleDelete(book.id)}
                  >
                    <Trash2 className="size-3" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
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
