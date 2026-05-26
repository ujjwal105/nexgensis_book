import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Layers3, Pencil, Trash2, UserRound } from "lucide-react";

import { BookFormModal } from "@/components/books/book-form-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useToast } from "@/components/ui/toast-context";
import { useBook } from "@/hooks/use-books";
import { useDeleteBook, useUpdateBook } from "@/hooks/use-books";
import type { BookDraft } from "@/types/book";

export function BookDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: book, error, isError, isLoading } = useBook(id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const deleteBookMutation = useDeleteBook();
  const updateBookMutation = useUpdateBook();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="h-72 animate-pulse rounded-[32px] bg-slate-200" />
      </div>
    );
  }

  if (isError || !book) {
    return <ErrorBanner message={error instanceof Error ? error.message : "Book not found"} />;
  }

  const handleDelete = async () => {
    try {
      await deleteBookMutation.mutateAsync(book.id);
      toast({ title: "Book deleted!", variant: "success" });
      navigate("/books");
    } catch (deleteError) {
      toast({
        description:
          deleteError instanceof Error ? deleteError.message : "Please try again.",
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
        description:
          updateError instanceof Error ? updateError.message : "Please try again.",
        title: "Failed to save book.",
        variant: "error",
      });
      throw updateError;
    }
  };

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" className="rounded-2xl text-slate-600">
        <Link to="/books">
          <ArrowLeft className="size-4" />
          Back to catalog
        </Link>
      </Button>

      <section
        className="overflow-hidden rounded-[36px] text-white shadow-[0_40px_120px_-70px_rgba(15,23,42,0.9)]"
        style={{
          background: `linear-gradient(135deg, ${book.coverColor} 0%, #0f172a 85%)`,
        }}
      >
        <div className="grid gap-8 px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[220px_1fr] lg:px-10">
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden rounded-[28px] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-sm">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-7xl font-semibold text-white/90">
                  {book.title.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div>
              <span className="inline-flex rounded-full bg-white/12 px-4 py-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-white/85 ring-1 ring-white/15">
                {book.genre}
              </span>
              <h1 className="mt-5 max-w-3xl text-[2.5rem] font-semibold leading-[0.95] tracking-[-0.05em] md:text-[4rem]">
                {book.title}
              </h1>
              <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-white/80 md:text-[1.06rem]">
                {book.description}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                <UserRound className="size-5 text-white/80" />
                <p className="mt-3 text-sm text-white/70">Author</p>
                <p className="mt-1 text-[1.2rem] font-semibold tracking-[-0.03em]">{book.author}</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                <Calendar className="size-5 text-white/80" />
                <p className="mt-3 text-sm text-white/70">Publication year</p>
                <p className="mt-1 text-[1.2rem] font-semibold tracking-[-0.03em]">{book.publicationYear}</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                <Layers3 className="size-5 text-white/80" />
                <p className="mt-3 text-sm text-white/70">Catalog type</p>
                <p className="mt-1 text-[1.2rem] font-semibold tracking-[-0.03em]">
                  {book.id.startsWith("local-") ? "Local custom" : "Hosted import"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-2xl bg-white text-slate-950 hover:bg-slate-100"
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil className="size-4" />
                Edit book
              </Button>
              <Button
                className="rounded-2xl bg-rose-500 text-white hover:bg-rose-600"
                onClick={handleDelete}
              >
                <Trash2 className="size-4" />
                Delete book
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
        <Card className="rounded-[28px] border border-slate-200/70 bg-white/88 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)]">
          <CardHeader>
            <CardTitle className="text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[1rem] leading-8 text-slate-600">
            {book.description}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-slate-200/70 bg-white/88 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)]">
          <CardHeader>
            <CardTitle className="text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="block text-slate-500">Book ID</span>
              <span className="mt-1 block break-all font-medium text-slate-900">
                {book.id}
              </span>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="block text-slate-500">Created at</span>
              <span className="mt-1 block font-medium text-slate-900">
                {new Date(book.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="block text-slate-500">Theme color</span>
              <div className="mt-2 flex items-center gap-3">
                <span
                  className="inline-flex size-6 rounded-full border border-slate-200"
                  style={{ backgroundColor: book.coverColor }}
                />
                <span className="font-medium text-slate-900">{book.coverColor}</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
