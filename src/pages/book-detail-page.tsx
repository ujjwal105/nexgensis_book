import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Layers3, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBook } from "@/hooks/use-books";

export function BookDetailPage() {
  const { id = "" } = useParams();
  const { data: book, error, isError, isLoading } = useBook(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="h-72 animate-pulse rounded-[32px] bg-slate-200" />
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-6 text-rose-700">
        {error instanceof Error ? error.message : "Book not found"}
      </div>
    );
  }

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
        <div className="grid gap-8 px-8 py-10 lg:grid-cols-[220px_1fr] lg:px-10">
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
              <span className="inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-medium text-white/85 ring-1 ring-white/15">
                {book.genre}
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                {book.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/80">
                {book.description}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                <UserRound className="size-5 text-white/80" />
                <p className="mt-3 text-sm text-white/70">Author</p>
                <p className="mt-1 text-lg font-medium">{book.author}</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                <Calendar className="size-5 text-white/80" />
                <p className="mt-3 text-sm text-white/70">Publication year</p>
                <p className="mt-1 text-lg font-medium">{book.publicationYear}</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                <Layers3 className="size-5 text-white/80" />
                <p className="mt-3 text-sm text-white/70">Catalog type</p>
                <p className="mt-1 text-lg font-medium">
                  {book.id.startsWith("local-") ? "Local custom" : "Hosted import"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
        <Card className="border border-slate-200/70 bg-white/85 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-950">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-slate-600">
            {book.description}
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 bg-white/85 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-950">
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
    </div>
  );
}
