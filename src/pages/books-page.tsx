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
    if (isCreateRequested) {
      clearCreateParam();
    }
  };

  const closeModal = () => {
    setSelectedBook(null);
    if (isCreateRequested) {
      clearCreateParam();
    }
  };

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchInput(value);
    });
  };

  const handleGenreChange = (value: string) => {
    startTransition(() => {
      setGenre(value);
    });
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
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "Please try again.",
        title: "Failed to save book.",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="rounded-[32px] bg-[linear-gradient(135deg,_#fff7ed_0%,_#ffedd5_26%,_#e0e7ff_100%)] p-6 shadow-[0_35px_100px_-60px_rgba(15,23,42,0.8)] ring-1 ring-white/70 md:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Catalog
            </p>
            <h1 className="mt-3 max-w-3xl text-[2.45rem] font-semibold leading-[0.94] tracking-[-0.05em] text-slate-950 md:text-[3.6rem]">
              A proper library view, not a placeholder dashboard.
            </h1>
            <p className="mt-5 max-w-2xl text-[1rem] leading-8 text-slate-600 md:text-[1.08rem]">
              Browse the hosted catalog, search it, filter by genre, inspect
              details, and add your own records into local persistent state.
            </p>
          </div>

          <div className="flex items-center gap-3 lg:pb-1">
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

      <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
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
        <ErrorBanner
          message={error instanceof Error ? error.message : "Unable to load books."}
          onRetry={() => {
            void refetch();
          }}
        />
      ) : null}

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: pageSize }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : books.length ? (
        <motion.div
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="show"
          className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3"
        >
          <AnimatePresence>
            {books.map((book) => (
              <motion.div
                key={book.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
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
                          deleteError instanceof Error
                            ? deleteError.message
                            : "Please try again.",
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

      <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200/70 bg-white/88 p-4 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)] sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          className="rounded-2xl"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1 || isLoading}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <div className="text-sm font-medium text-slate-500">
          {data?.totalItems ?? 0} total books
        </div>
        <Button
          variant="ghost"
          className="rounded-2xl"
          onClick={() => setPage(data?.hasNextPage ? page + 1 : page)}
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
