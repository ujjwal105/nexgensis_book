import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LoaderCircle, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { BookCard } from "@/components/books/book-card";
import { BookFormModal } from "@/components/books/book-form-modal";
import { EmptyState } from "@/components/books/empty-state";
import { SearchAndFilter } from "@/components/books/search-and-filter";
import { SkeletonCard } from "@/components/books/skeleton-card";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useToast } from "@/components/ui/toast-context";
import {
  useBooks,
  useCreateBook,
  useDeleteBook,
  useUpdateBook,
} from "@/hooks/use-books";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useLocalFilters } from "@/hooks/use-local-filters";
import type { Book, BookDraft } from "@/types/book";

const pageSize = 9;

export function BooksPage() {
  const { genre, page, reset, search: searchFromParams, setGenre, setPage, setSearch } =
    useLocalFilters();
  const [params, setParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchFromParams);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();
  const isCreateRequested = params.get("create") === "true";
  const isModalOpen = Boolean(selectedBook) || isCreateRequested;

  const deferredSearch = useDeferredValue(searchInput);
  const search = useDebouncedValue(deferredSearch, 250);
  const filters = useMemo(
    () => ({ search, genre, page, limit: pageSize }),
    [genre, page, search],
  );

  const { data, error, isError, isFetching, isLoading, refetch } = useBooks(filters);
  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();

  const books = data?.data ?? [];
  const hasActiveFilters = Boolean(search.trim() || genre);

  useEffect(() => {
    if (search !== searchFromParams) {
      setSearch(search);
    }
  }, [search, searchFromParams, setSearch]);

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

  const handleSearchChange = (value: string) => {
    startTransition(() => setSearchInput(value));
  };

  const handleGenreChange = (value: string) => {
    startTransition(() => setGenre(value));
  };

  const handleClearFilters = () => {
    startTransition(() => {
      setSearchInput("");
      reset();
    });
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

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Books</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Browse, search, and manage your library.
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
          onClick={openCreateModal}
        >
          <Plus className="size-3.5" />
          Add book
        </Button>
      </div>

      {/* Search & filter */}
      <SearchAndFilter
        search={searchInput}
        genre={genre}
        resultsCount={data?.totalItems ?? 0}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        onGenreChange={handleGenreChange}
        onSearchChange={handleSearchChange}
      />

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Page {data?.page ?? page} of {data?.totalPages ?? 1}
        </span>
        {isFetching && !isLoading ? (
          <span className="flex items-center gap-1.5 text-indigo-500">
            <LoaderCircle className="size-3 animate-spin" />
            Refreshing
          </span>
        ) : null}
      </div>

      {/* Error */}
      {isError ? (
        <ErrorBanner
          message={error instanceof Error ? error.message : "Unable to load books."}
          onRetry={() => void refetch()}
        />
      ) : null}

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: pageSize }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : books.length ? (
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
        >
          <AnimatePresence>
            {books.map((book) => (
              <motion.div
                key={book.id}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              >
                <BookCard
                  book={book}
                  onEdit={openEditModal}
                  onDelete={async (id) => {
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
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState hasFilters={hasActiveFilters} onAction={openCreateModal} />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1 || isLoading}
        >
          <ChevronLeft className="size-3.5" />
          Previous
        </Button>
        <span className="text-xs font-medium text-slate-400">
          {data?.totalItems ?? 0} books total
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setPage(data?.hasNextPage ? page + 1 : page)}
          disabled={!data?.hasNextPage || isLoading}
        >
          Next
          <ChevronRight className="size-3.5" />
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
