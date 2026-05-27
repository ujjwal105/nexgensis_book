import { useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  BookMarked,
  CheckCircle2,
  ChevronRight,
  FolderPlus,
  LayoutGrid,
  LoaderCircle,
  Plus,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import { BookFormModal } from "@/components/books/book-form-modal";
import { EmptyState } from "@/components/books/empty-state";
import { BookContextMenu, type BookContextMenuVariant } from "@/components/ui/book-context-menu";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useToast } from "@/components/ui/toast-context";
import {
  useBooks,
  useCreateBook,
  useDeleteBook,
  useUpdateBook,
} from "@/hooks/use-books";
import { useBookLists, type BookListKey } from "@/hooks/use-book-lists";
import type { Book, BookDraft } from "@/types/book";

/* ─── List-view config ───────────────────────────────────────────── */

type BookListViewKey = BookListKey | "my-samples" | "all";

const LIST_CONFIG: Record<
  BookListViewKey,
  { label: string; icon: typeof BookMarked; emptyHint: string }
> = {
  all: {
    label: "All Books",
    icon: LayoutGrid,
    emptyHint: "Browse every book in your catalog.",
  },
  "want-to-read": {
    label: "Want to Read",
    icon: BookMarked,
    emptyHint:
      "Browse the store and mark books you want to read from the ⋮ menu.",
  },
  finished: {
    label: "Finished",
    icon: CheckCircle2,
    emptyHint: "Mark books as finished from the ⋮ menu on any book.",
  },
  "my-samples": {
    label: "My Samples",
    icon: FolderPlus,
    emptyHint: "Books you add locally will appear here automatically.",
  },
  collection: {
    label: "Collection",
    icon: FolderPlus,
    emptyHint: "Add books to your collection from the ⋮ menu.",
  },
};

const LIST_ROUTE_MAP: Record<string, BookListViewKey> = {
  "/books/all": "all",
  "/books/want-to-read": "want-to-read",
  "/books/finished": "finished",
  "/books/my-samples": "my-samples",
};

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
          <p className="mt-1 line-clamp-1 text-[0.75rem] text-white/70">
            {book.author}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── ShelfBook (horizontal scroll card) ───────────────────────── */

function ShelfBook({
  book,
  detailLinkState,
}: {
  book: Book;
  detailLinkState: { from: string };
}) {
  return (
    <Link
      to={`/books/${book.id}`}
      state={detailLinkState}
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
  menuVariant = "default",
  detailLinkState,
}: {
  book: Book;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
  menuVariant?: BookContextMenuVariant;
  detailLinkState: { from: string };
}) {
  return (
    <div className="group flex items-center gap-4 border-b border-slate-100 dark:border-white/6 py-3.5 last:border-b-0">
      {/* Rank number — matches Apple Books: compact, muted */}
      <span className="w-7 flex-none text-[1.4rem] font-semibold leading-none tracking-tight text-slate-300 dark:text-white/40">
        {index + 1}
      </span>

      <Link
        to={`/books/${book.id}`}
        state={detailLinkState}
        className="flex flex-1 items-center gap-3 min-w-0"
      >
        <BookCover
          book={book}
          className="h-[60px] w-[44px] flex-none rounded-[10px]"
          showText={false}
        />
        <div className="min-w-0">
          <p className="truncate text-[0.92rem] font-semibold tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
            {book.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-white/50">
            {book.author}
          </p>
        </div>
      </Link>

      <BookContextMenu
        bookId={book.id}
        onEdit={() => onEdit(book)}
        onDelete={() => onDelete(book.id)}
        variant={menuVariant}
      />
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

/* ─── LibraryCoverCard ──────────────────────────────────────────── */

function LibraryCoverCard({
  book,
  onEdit,
  onDelete,
  menuVariant = "default",
  detailLinkState,
}: {
  book: Book;
  onEdit: () => void;
  onDelete: () => void;
  menuVariant?: BookContextMenuVariant;
  detailLinkState: { from: string };
}) {
  return (
    <div className="group relative">
      <Link to={`/books/${book.id}`} state={detailLinkState} className="block">
        <BookCover
          book={book}
          className="aspect-[2/3] w-full rounded-[14px]"
          showText={false}
        />
      </Link>

      {/* Below-cover row */}
      <div className="mt-2 flex items-start justify-between gap-1 pr-0.5">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[0.73rem] font-semibold leading-tight text-slate-700 dark:text-white/80">
            {book.title}
          </p>
          <p className="mt-0.5 truncate text-[0.62rem] text-slate-400 dark:text-white/35">
            {book.author}
          </p>
        </div>
        <BookContextMenu
          bookId={book.id}
          onEdit={onEdit}
          onDelete={onDelete}
          variant={menuVariant}
          triggerClassName="mt-0.5 flex-none opacity-100"
        />
      </div>
    </div>
  );
}

/* ─── BooksPage ─────────────────────────────────────────────────── */

export function BooksPage() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();
  const { data, error, isError, isFetching, isLoading, refetch } = useBooks({
    page: 1,
    limit: 1000,
  });
  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();
  const { isIn } = useBookLists();

  const isCreateRequested = params.get("create") === "true";
  const isModalOpen = Boolean(selectedBook) || isCreateRequested;
  const books = useMemo(
    () => sortBooksByRecency(data?.data ?? []),
    [data?.data],
  );
  const totalBookCount = data?.totalItems ?? 0;

  const listFilter = LIST_ROUTE_MAP[location.pathname] ?? null;
  const isListView = Boolean(listFilter);
  const listFilteredBooks =
    listFilter === "my-samples"
      ? books.filter((b) => b.id.startsWith("local-"))
      : listFilter && listFilter !== "all"
        ? books.filter((b) => isIn(listFilter as BookListKey, b.id))
        : books;

  const menuVariant: BookContextMenuVariant =
    listFilter === "want-to-read"
      ? "want-to-read"
      : listFilter === "finished"
        ? "finished"
        : listFilter === "my-samples"
          ? "samples"
          : "default";
  const detailLinkState = {
    from: `${location.pathname}${location.search}`,
  };

  const featuredBooks = books.slice(0, 3);
  const rankedBooks = books.slice(0, 6);
  const genreShelves = useMemo(
    () => groupBooksByGenre(books).slice(0, 4),
    [books],
  );
  const curatedShelf = books.slice(3, 9);
  const fictionShelf = genreShelves.find(([g]) =>
    g.toLowerCase().includes("fiction"),
  );
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
        await updateBookMutation.mutateAsync({
          id: selectedBook.id,
          bookData: formData,
        });
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
          deleteError instanceof Error
            ? deleteError.message
            : "Please try again.",
        title: "Failed to delete book.",
        variant: "error",
      });
    }
  };

  if (isError) {
    return (
      <ErrorBanner
        message={
          error instanceof Error ? error.message : "Unable to load books."
        }
        onRetry={() => void refetch()}
      />
    );
  }

  /* ── All-books cover grid (Apple Books "All" view) ─────────────── */
  if (isListView && listFilter === "all") {
    return (
      <>
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[2rem] font-bold tracking-tight text-slate-900 dark:text-white">
                All
              </h1>
              {!isLoading && totalBookCount > 0 && (
                <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-100 px-2 text-[0.7rem] font-semibold text-slate-500 dark:bg-white/10 dark:text-white/50">
                  {totalBookCount}
                </span>
              )}
            </div>
            <p className="mt-1 text-[0.82rem] text-slate-400 dark:text-white/35">
              Your complete book library
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full px-4"
            onClick={openCreateModal}
          >
            <Plus className="size-3.5" />
            Add Book
          </Button>
        </div>

        {isLoading ? (
          /* Skeleton grid */
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] rounded-[14px] bg-slate-200 dark:bg-white/8" />
                <div className="mt-2 h-2.5 w-3/4 rounded bg-slate-200 dark:bg-white/8" />
                <div className="mt-1.5 h-2 w-1/2 rounded bg-slate-100 dark:bg-white/5" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <EmptyState hasFilters={false} onAction={openCreateModal} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {books.map((book) => (
              <LibraryCoverCard
                key={book.id}
                book={book}
                onEdit={() => openEditModal(book)}
                onDelete={() => void handleDelete(book.id)}
                menuVariant={menuVariant}
                detailLinkState={detailLinkState}
              />
            ))}
          </div>
        )}

        <BookFormModal
          book={selectedBook}
          isOpen={isModalOpen}
          isLoading={
            createBookMutation.isPending || updateBookMutation.isPending
          }
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      </>
    );
  }

  /* ── List view (Want to Read / Finished / Collection / My Samples) */
  if (isListView && listFilter && !isLoading) {
    const { label, icon: ListIcon, emptyHint } = LIST_CONFIG[listFilter];
    return (
      <>
        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            {/* Title row */}
            <div className="flex items-center gap-3">
              <h1 className="text-[2rem] font-bold tracking-tight text-slate-900 dark:text-white">
                {label}
              </h1>
              {listFilteredBooks.length > 0 && (
                <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-100 px-2 text-[0.7rem] font-semibold text-slate-500 dark:bg-white/10 dark:text-white/50">
                  {listFilteredBooks.length}
                </span>
              )}
            </div>
            {/* Subtitle */}
            {emptyHint && (
              <p className="mt-1 text-[0.82rem] text-slate-400 dark:text-white/35">
                {emptyHint}
              </p>
            )}
          </div>

          {/* Action button — only for My Samples */}
          {listFilter === "my-samples" && (
            <Button
              size="sm"
              variant="outline"
              onClick={openCreateModal}
              className="flex-none rounded-full border-2 border-emerald-300/80 bg-transparent px-4 text-black shadow-none hover:border-emerald-200 hover:bg-white/5 hover:text-white dark:border-emerald-300/80 dark:bg-transparent dark:text-white/85 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <Plus className="size-4" />
              Add Book
            </Button>
          )}
        </div>

        {/* ── Content ──────────────────────────────────────────────── */}
        {listFilteredBooks.length === 0 ? (
          /* Full-height centered empty state — no border box */
          <div className="flex min-h-[52vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/6">
              <ListIcon className="size-7 text-slate-300 dark:text-white/25" />
            </div>
            <div>
              <p className="text-[0.95rem] font-semibold text-slate-500 dark:text-white/45">
                Nothing here yet
              </p>
              <p className="mt-1 max-w-[22rem] text-[0.78rem] leading-relaxed text-slate-400 dark:text-white/30">
                {emptyHint}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {listFilteredBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md dark:border-white/6 dark:bg-[#232324] dark:hover:border-white/10"
              >
                <Link
                  to={`/books/${book.id}`}
                  state={detailLinkState}
                  className="flex min-w-0 flex-1 items-center gap-4"
                >
                  <BookCover
                    book={book}
                    className="h-[68px] w-[50px] flex-none rounded-[10px]"
                    showText={false}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[0.88rem] font-semibold leading-snug tracking-tight text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
                      {book.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-white/45">
                      {book.author}
                    </p>
                    <span className="mt-2 inline-block rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white/72">
                      {book.genre}
                    </span>
                  </div>
                </Link>
                <BookContextMenu
                  bookId={book.id}
                  onEdit={() => openEditModal(book)}
                  onDelete={() => void handleDelete(book.id)}
                  variant={menuVariant}
                />
              </div>
            ))}
          </div>
        )}

        <BookFormModal
          book={selectedBook}
          isOpen={isModalOpen}
          isLoading={
            createBookMutation.isPending || updateBookMutation.isPending
          }
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      </>
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
      <div className="-mx-5 -mt-5 overflow-hidden bg-white dark:bg-[#1c1c1d] md:-mx-6 md:-mt-6 md:rounded-b-[28px] md:border md:border-slate-200/60 dark:md:border-white/6 shadow-sm">
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
                  variant="outline"
                  className="rounded-full px-4"
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
                  <div
                    key={i}
                    className="h-[360px] animate-pulse rounded-[18px] bg-slate-200 dark:bg-white/6"
                  />
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
                    <Link
                      to={`/books/${book.id}`}
                      state={detailLinkState}
                      className="block"
                    >
                      <BookCover
                        book={book}
                        className="h-[360px] w-full"
                        priority={index === 0}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Fiction shelf ── */}
        <div className="border-t border-slate-100 dark:border-white/5 px-6 py-10 md:px-10">
          <SectionHeading
            title={
              libraryShelf.length ? "Fiction & Literature" : "Curated Shelf"
            }
          />
          <div className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {libraryShelf.map((book) => (
              <ShelfBook
                key={book.id}
                book={book}
                detailLinkState={detailLinkState}
              />
            ))}
          </div>
        </div>

        {/* ── Top Free (ranked) ── */}
        <div className="border-t border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.018] px-6 py-10 md:px-10">
          <SectionHeading title="Top Chart" />
          <div className="grid gap-x-10 xl:grid-cols-2">
            {rankedBooks.map((book, index) => (
              <RankedBookRow
                key={book.id}
                book={book}
                index={index}
                onDelete={(id) => void handleDelete(id)}
                onEdit={openEditModal}
                menuVariant={menuVariant}
                detailLinkState={detailLinkState}
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
                  <ShelfBook
                    book={book}
                    detailLinkState={detailLinkState}
                  />
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
                <Sparkles className="size-3.5 text-emerald-400 dark:text-emerald-300" />
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
                <BookCover
                  book={book}
                  className="h-[72px] w-[52px] flex-none rounded-[10px]"
                  showText={false}
                />
                <div className="min-w-0 flex-1">
                  <Link to={`/books/${book.id}`} state={detailLinkState}>
                    <p className="line-clamp-2 text-[0.88rem] font-semibold leading-snug tracking-tight text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
                      {book.title}
                    </p>
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-white/50">
                    {book.author}
                  </p>
                  <p className="mt-1.5 text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-slate-600 dark:text-white/68">
                    {book.genre}
                  </p>
                </div>
                <BookContextMenu
                  bookId={book.id}
                  onEdit={() => openEditModal(book)}
                  onDelete={() => void handleDelete(book.id)}
                  variant={menuVariant}
                />
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
