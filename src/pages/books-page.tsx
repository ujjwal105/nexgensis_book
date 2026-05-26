import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle, Plus } from "lucide-react";

import { BookCard } from "@/components/books/book-card";
import { BookFormModal } from "@/components/books/book-form-modal";
import { EmptyState } from "@/components/books/empty-state";
import { SearchAndFilter } from "@/components/books/search-and-filter";
import { SkeletonCard } from "@/components/books/skeleton-card";
import { Button } from "@/components/ui/button";
import {
  useBooks,
  useCreateBook,
  useDeleteBook,
  useUpdateBook,
} from "@/hooks/use-books";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { Book, BookDraft } from "@/types/book";

const pageSize = 9;

export function BooksPage() {
  const [searchInput, setSearchInput] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const deferredSearch = useDeferredValue(searchInput);
  const search = useDebouncedValue(deferredSearch, 250);
  const filters = useMemo(
    () => ({ search, genre, page, limit: pageSize }),
    [genre, page, search],
  );

  const { data, error, isError, isFetching, isLoading } = useBooks(filters);
  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();

  const books = data?.data ?? [];
  const hasActiveFilters = Boolean(search.trim() || genre);

  const openCreateModal = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setIsModalOpen(false);
  };

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchInput(value);
      setPage(1);
    });
  };

  const handleGenreChange = (value: string) => {
    startTransition(() => {
      setGenre(value);
      setPage(1);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      setSearchInput("");
      setGenre("");
      setPage(1);
    });
  };

  const handleSubmit = async (formData: BookDraft) => {
    if (selectedBook) {
      await updateBookMutation.mutateAsync({ id: selectedBook.id, bookData: formData });
      return;
    }

    await createBookMutation.mutateAsync(formData);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-[linear-gradient(135deg,_#fff7ed_0%,_#ffedd5_30%,_#e0e7ff_100%)] p-6 shadow-[0_35px_100px_-60px_rgba(15,23,42,0.8)] ring-1 ring-white/70 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Catalog
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              A proper library view, not a placeholder dashboard.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Browse the hosted catalog, search it, filter by genre, inspect
              details, and add your own records into local persistent state.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="lg"
              className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
              onClick={openCreateModal}
            >
              <Plus className="size-4" />
              Add book
            </Button>
          </div>
        </div>
      </section>

      <SearchAndFilter
        search={searchInput}
        genre={genre}
        resultsCount={data?.totalItems ?? 0}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        onGenreChange={handleGenreChange}
        onSearchChange={handleSearchChange}
      />

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Page {data?.page ?? page} of {data?.totalPages ?? 1}
        </span>
        {isFetching && !isLoading ? (
          <span className="flex items-center gap-2 text-indigo-600">
            <LoaderCircle className="size-4 animate-spin" />
            Refreshing catalog
          </span>
        ) : null}
      </div>

      {isError ? (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
          {error instanceof Error ? error.message : "Unable to load books."}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: pageSize }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : books.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={openEditModal}
              onDelete={(id) => deleteBookMutation.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState hasFilters={hasActiveFilters} onAction={openCreateModal} />
      )}

      <div className="flex items-center justify-between rounded-[24px] border border-slate-200/70 bg-white/85 p-4 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)]">
        <Button
          variant="ghost"
          className="rounded-2xl"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page <= 1 || isLoading}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <div className="text-sm text-slate-500">
          {data?.totalItems ?? 0} total books
        </div>
        <Button
          variant="ghost"
          className="rounded-2xl"
          onClick={() =>
            setPage((current) =>
              data?.hasNextPage ? current + 1 : current,
            )
          }
          disabled={!data?.hasNextPage || isLoading}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <BookFormModal
        book={selectedBook}
        isOpen={isModalOpen}
        isLoading={createBookMutation.isPending || updateBookMutation.isPending}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
