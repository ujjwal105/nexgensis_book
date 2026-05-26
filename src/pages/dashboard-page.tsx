import {
  ArrowRight,
  BookCopy,
  Boxes,
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
      label: "Curated Titles",
      value: String(totalItems),
      accent: "bg-indigo-500",
      icon: BookCopy,
    },
    {
      label: "Active Categories",
      value: String(totalGenres),
      accent: "bg-emerald-500",
      icon: Boxes,
    },
    {
      label: "Workspace Status",
      value: "Ready",
      accent: "bg-rose-500",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,_#0f172a_0%,_#172554_35%,_#6d28d9_100%)] px-6 py-8 text-white shadow-[0_40px_120px_-70px_rgba(49,46,129,0.9)] md:px-8 md:py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.3em] text-indigo-200/80">
              Nexgensis Library
            </p>
            <h2 className="mt-3 text-[2.4rem] font-semibold leading-[0.95] tracking-[-0.05em] md:text-[4rem]">
              A focused digital bookshelf for discovering and managing every title in one place.
            </h2>
            <p className="mt-5 max-w-2xl text-[1rem] leading-8 text-indigo-100/85 md:text-[1.08rem]">
              Nexgensis Book System brings your collection into a calm, modern workspace built
              for browsing, organizing, and keeping the catalog clear at every step.
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
            <div className="rounded-[24px] bg-white/10 p-5">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.25em] text-white/60">
                Brand promise
              </p>
              <p className="mt-2 text-[1.8rem] font-semibold leading-tight tracking-[-0.04em]">
                Clarity across every shelf
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] bg-white/10 p-4">
                <p className="text-sm text-white/60">Experience</p>
                <p className="mt-2 text-[1.35rem] font-semibold tracking-[-0.03em]">Editorial and clean</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4">
                <p className="text-sm text-white/60">Designed for</p>
                <p className="mt-2 text-[1.35rem] font-semibold tracking-[-0.03em]">
                  Modern library teams
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, accent, icon: Icon }) => (
          <Card
            key={label}
            className="rounded-[28px] border-0 bg-white/92 shadow-[0_18px_60px_-45px_rgba(15,23,42,0.8)] transition-transform duration-200 hover:-translate-y-1"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription className="text-[0.96rem]">{label}</CardDescription>
                  <CardTitle className="mt-2 text-[2.6rem] font-semibold tracking-[-0.05em]">
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

      <section>
        <Card className="rounded-[28px] border border-slate-200/70 bg-white/88 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)]">
          <CardHeader>
            <CardDescription className="text-[0.96rem]">Catalog Preview</CardDescription>
            <CardTitle className="text-[2rem] font-semibold tracking-[-0.04em]">
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
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div
                        className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white"
                        style={{ backgroundColor: book.coverColor }}
                      >
                        {book.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[1.08rem] font-semibold tracking-[-0.02em] text-slate-900">
                          {book.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                      </div>
                      <span
                        className="inline-flex w-fit rounded-full px-3 py-1 text-[0.78rem] font-semibold text-white"
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
      </section>
    </div>
  );
}
