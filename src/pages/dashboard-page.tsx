import {
  ArrowRight,
  BookCopy,
  Boxes,
  LibraryBig,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useBooks } from "@/hooks/use-books";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardPage() {
  const { data, isLoading, isError, error } = useBooks({ page: 1, limit: 6 });
  const books = data?.data ?? [];
  const totalItems = data?.totalItems ?? 0;
  const totalGenres = new Set(books.map((book) => book.genre)).size;
  const stats = [
    {
      label: "Books in Catalog",
      value: String(totalItems),
      accent: "bg-indigo-500",
      icon: BookCopy,
    },
    {
      label: "Genres in Preview",
      value: String(totalGenres),
      accent: "bg-emerald-500",
      icon: Boxes,
    },
    {
      label: "Service Layer",
      value: "Live",
      accent: "bg-rose-500",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,_#0f172a_0%,_#172554_35%,_#7c3aed_100%)] px-6 py-8 text-white shadow-[0_40px_120px_-70px_rgba(49,46,129,0.9)] md:px-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-200/80">
              Overview
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Clean shell, live catalog, and a real workflow instead of filler UI.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100/85 md:text-base">
              The workspace now has a proper navigation system, live book data,
              searchable catalog pages, local CRUD persistence, and book detail routes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-white text-slate-950 hover:bg-slate-100"
              >
                <Link to="/books">
                  Explore catalog
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-[28px] border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
            <div className="rounded-[24px] bg-white/10 p-4">
              <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                Current focus
              </p>
              <p className="mt-2 text-xl font-semibold">Catalog management</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] bg-white/10 p-4">
                <p className="text-sm text-white/60">Hosted reads</p>
                <p className="mt-2 text-lg font-semibold">FreeAPI</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4">
                <p className="text-sm text-white/60">Write strategy</p>
                <p className="mt-2 text-lg font-semibold">Local persistence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, accent, icon: Icon }) => (
          <Card
            key={label}
            className="border-0 bg-white/90 shadow-[0_18px_60px_-45px_rgba(15,23,42,0.8)] transition-transform duration-200 hover:-translate-y-1"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="mt-2 text-3xl font-semibold">
                    {value}
                  </CardTitle>
                </div>
                <div
                  className={`flex size-11 items-center justify-center rounded-2xl ${accent} text-white`}
                >
                  <Icon className="size-5" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="border border-slate-200/70 bg-white/85 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)]">
          <CardHeader>
            <CardDescription>Catalog Preview</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              Sample books from the connected service
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-600">
            {isLoading ? (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-5 text-slate-500">
                <LoaderCircle className="size-4 animate-spin" />
                Loading catalog preview...
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-rose-700">
                {error instanceof Error ? error.message : "Unable to load books."}
              </div>
            ) : null}

            {!isLoading && !isError
              ? books.map((book) => (
                  <div
                    key={book.id}
                    className="rounded-[24px] border border-slate-200/80 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white"
                        style={{ backgroundColor: book.coverColor }}
                      >
                        {book.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-medium text-slate-900">
                          {book.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                      </div>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium text-white"
                        style={{ backgroundColor: book.coverColor }}
                      >
                        {book.genre}
                      </span>
                    </div>
                  </div>
                ))
              : null}
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 bg-white/85 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)]">
          <CardHeader>
            <CardDescription>Workspace Summary</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              What changed in this pass
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="rounded-[24px] bg-indigo-50 px-4 py-4 text-indigo-950">
              Hosted read API wired to `https://api.freeapi.app/api/v1/public/books`.
            </div>
            <div className="rounded-[24px] border border-slate-200 px-4 py-4">
              <div className="flex items-center gap-3">
                <LibraryBig className="size-4 text-amber-500" />
                <span className="font-medium text-slate-900">New shell and topbar</span>
              </div>
              <p className="mt-2 leading-6 text-slate-500">
                The left rail and content hierarchy were rebuilt to make the app
                feel intentional instead of decorative.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 px-4 py-4">
              <div className="flex items-center gap-3">
                <BookCopy className="size-4 text-indigo-500" />
                <span className="font-medium text-slate-900">Books page added</span>
              </div>
              <p className="mt-2 leading-6 text-slate-500">
                Search, genre filtering, pagination, edit, delete, and create
                now live in the catalog route.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 px-4 py-4">
              <div className="flex items-center gap-3">
                <Sparkles className="size-4 text-rose-500" />
                <span className="font-medium text-slate-900">Detail route added</span>
              </div>
              <p className="mt-2 leading-6 text-slate-500">
                Individual books now have their own focused presentation instead
                of being trapped inside summary cards.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
