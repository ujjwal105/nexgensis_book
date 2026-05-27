import { useState, useRef, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Hash, Layers3, Palette, UserRound } from "lucide-react";

import { BookFormModal } from "@/components/books/book-form-modal";
import { BookContextMenu } from "@/components/ui/book-context-menu";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useToast } from "@/components/ui/toast-context";
import { useBook, useDeleteBook, useUpdateBook } from "@/hooks/use-books";
import type { BookDraft } from "@/types/book";

export function BookDetailPage() {
  const { id = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: book, error, isError, isLoading } = useBook(id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);
  const deleteBookMutation = useDeleteBook();
  const updateBookMutation = useUpdateBook();
  const { toast } = useToast();
  const backHref =
    typeof location.state?.from === "string" ? location.state.from : "/books";

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [book?.description]);

  if (isLoading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-white/8" />
        <div className="h-52 animate-pulse rounded-xl bg-slate-200 dark:bg-white/8" />
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="h-48 animate-pulse rounded-xl bg-slate-200 dark:bg-white/8" />
          <div className="h-48 animate-pulse rounded-xl bg-slate-200 dark:bg-white/8" />
        </div>
      </div>
    );

  }

  if (isError || !book) {
    const message =
      error instanceof Error ? error.message.toLowerCase() : "book not found";
    const isMissingBook =
      message.includes("not found") || message.includes("does not exist");

    if (isMissingBook || !book) {
      return <Navigate to="/not-found" replace />;
    }

    return (
      <ErrorBanner
        message={error instanceof Error ? error.message : "Unable to load book."}
      />
    );
  }

  const handleDelete = async () => {
    try {
      await deleteBookMutation.mutateAsync(book.id);
      toast({ title: "Book deleted!", variant: "success" });
      navigate("/books");
    } catch (deleteError) {
      toast({
        description: deleteError instanceof Error ? deleteError.message : "Please try again.",
        title: "Failed to delete book.",
        variant: "error",
      });
    }
  };

  const handleUpdate = async (data: BookDraft) => {
    try {
      await updateBookMutation.mutateAsync({ id: book.id, bookData: data });
      toast({ title: "Book updated!", variant: "success" });
    } catch (updateError) {
      toast({
        description: updateError instanceof Error ? updateError.message : "Please try again.",
        title: "Failed to save book.",
        variant: "error",
      });
      throw updateError;
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back nav + actions */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 -ml-1 h-8 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/8">
          <Link to={backHref}>
            <ArrowLeft className="size-3.5" />
            Back to Books
          </Link>
        </Button>

        <BookContextMenu
          bookId={book.id}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => void handleDelete()}
        />
      </div>

      {/* Hero */}
      <div
        className="overflow-hidden rounded-xl shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${book.coverColor}ee 0%, #0f172a 100%)`,
        }}
      >
        <div className="grid gap-6 px-6 py-6 md:px-8 md:py-7 lg:grid-cols-[180px_1fr]">
          {/* Book cover */}
          <div className="hidden lg:block flex-none">
            <div className="aspect-[3/4] overflow-hidden rounded-lg border border-white/15 bg-white/10 shadow-lg">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-5xl font-bold text-white/80">
                  {book.title.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Book info */}
          <div className="flex flex-col gap-5 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[0.72rem] font-semibold text-white/90 ring-1 ring-white/20">
                  {book.genre}
                </span>
                <span className="text-[0.72rem] text-white/50">
                  {book.id.startsWith("local-") ? "Local" : "Catalog"}
                </span>
              </div>
              <h1 className="mt-3 text-[1.8rem] font-bold leading-tight tracking-tight text-white md:text-[2.4rem]">
                {book.title}
              </h1>
              <p className="mt-2 text-sm text-white/70 leading-relaxed max-w-2xl line-clamp-4">
                {book.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-white/10 px-3 py-2.5 ring-1 ring-white/10">
                <div className="flex items-center gap-1.5 text-white/50">
                  <UserRound className="size-3" />
                  <span className="text-[0.65rem] font-medium uppercase tracking-wide">Author</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">{book.author}</p>
              </div>
              <div className="rounded-lg bg-white/10 px-3 py-2.5 ring-1 ring-white/10">
                <div className="flex items-center gap-1.5 text-white/50">
                  <Calendar className="size-3" />
                  <span className="text-[0.65rem] font-medium uppercase tracking-wide">Year</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">{book.publicationYear}</p>
              </div>
              <div className="rounded-lg bg-white/10 px-3 py-2.5 ring-1 ring-white/10">
                <div className="flex items-center gap-1.5 text-white/50">
                  <Layers3 className="size-3" />
                  <span className="text-[0.65rem] font-medium uppercase tracking-wide">Type</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">
                  {book.id.startsWith("local-") ? "Custom" : "Hosted"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Description */}
        <div className="rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#232324] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white/90">About this book</h2>
          <p
            ref={descRef}
            className={`mt-3 text-sm leading-relaxed text-slate-600 dark:text-white/60 ${!isDescExpanded ? "line-clamp-5" : ""}`}
          >
            {book.description}
          </p>
          {isOverflowing || isDescExpanded ? (
            <button
              onClick={() => setIsDescExpanded((prev) => !prev)}
              className="mt-2 text-xs font-medium text-blue-700 dark:text-blue-600 hover:text-slate-800 dark:hover:text-white/80 transition-colors"
            >
              {isDescExpanded ? "Show less ↑" : "Read more ↓"}
            </button>
          ) : null}
        </div>

        {/* Metadata */}
        <div className="rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#232324] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white/90">Metadata</h2>
          <div className="mt-3 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/40 mb-1">
                <Hash className="size-3" />
                <span>Book ID</span>
              </div>
              <p className="rounded-md bg-slate-50 dark:bg-white/8 px-3 py-2 text-xs font-mono text-slate-700 dark:text-white/75 break-all">
                {book.id}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/40 mb-1">
                <Calendar className="size-3" />
                <span>Created</span>
              </div>
              <p className="rounded-md bg-slate-50 dark:bg-white/8 px-3 py-2 text-xs text-slate-700 dark:text-white/75">
                {new Date(book.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/40 mb-1">
                <Palette className="size-3" />
                <span>Theme color</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-slate-50 dark:bg-white/8 px-3 py-2">
                <span
                  className="size-4 rounded-full border border-slate-200 dark:border-white/10 flex-none"
                  style={{ backgroundColor: book.coverColor }}
                />
                <span className="text-xs font-mono text-slate-700">{book.coverColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookFormModal
        book={book}
        isOpen={isEditOpen}
        isLoading={updateBookMutation.isPending}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
