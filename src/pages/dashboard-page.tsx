import { ArrowRight, BookCopy, Boxes, Plus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import { useBooks } from "@/hooks/use-books";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";

function RecentBookCard({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      state={{ from: "/home" }}
      className="group block min-w-[180px] max-w-[180px] snap-start transition-transform duration-200 hover:-translate-y-1"
    >
      <div
        className="relative h-[270px] overflow-hidden rounded-[26px] border shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
        style={{
          backgroundColor: book.coverColor,
          borderColor: `${book.coverColor}66`,
        }}
      >
        {book.coverImage ? (
          <>
            <img
              src={book.coverImage}
              alt={book.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_26%,rgba(0,0,0,0.24)_100%)]" />
            <div className="absolute inset-y-4 left-3 w-px bg-white/28" />
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="line-clamp-2 text-[0.98rem] font-semibold leading-tight tracking-tight drop-shadow">
            {book.title}
          </p>
          <p className="mt-2 line-clamp-1 text-sm text-white/72">
            {book.author}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function DashboardPage() {
  const { data, isLoading, isError, error } = useBooks({ page: 1, limit: 6 });
  const books = data?.data ?? [];
  const totalItems = data?.totalItems ?? 0;
  const totalGenres = new Set(books.map((b) => b.genre)).size;

  const stats = [
    {
      label: "Total Books",
      value: isLoading ? null : String(totalItems),
      sub: "across the catalog",
      icon: BookCopy,
      iconColor: "text-emerald-600 dark:text-emerald-300",
      iconBg: "bg-emerald-50 dark:bg-emerald-400/10",
      trend: "+12 this month",
    },
    {
      label: "Genres",
      value: isLoading ? null : String(totalGenres),
      sub: "unique categories",
      icon: Boxes,
      iconColor: "text-emerald-600 dark:text-emerald-300",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      trend: "Well curated",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white/90 tracking-tight">
            Home
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/60">
            Your book catalog at a glance.
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="rounded-full bg-emerald-600 px-3.5 text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-300 md:hidden"
        >
          <Link to="/books?create=true">
            <Plus className="size-3.5" />
            Add
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map(
          ({ label, value, sub, icon: Icon, iconColor, iconBg, trend }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-[#232324] dark:border-white/8"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-white/60 uppercase tracking-wide">
                    {label}
                  </p>
                  {value === null ? (
                    <div className="mt-2 h-7 w-16 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                  ) : (
                    <p className="mt-1.5 text-2xl font-bold text-slate-900 dark:text-white/90 tracking-tight">
                      {value}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-400 dark:text-white/40">
                    {sub}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex size-9 flex-none items-center justify-center rounded-lg",
                    iconBg,
                  )}
                >
                  <Icon className={cn("size-4", iconColor)} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/60">
                <TrendingUp className="size-3 text-emerald-500" />
                <span>{trend}</span>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Recent books */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:bg-[#232324] dark:border-white/8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/8">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white/90">
              Recent Books
            </h3>
            <p className="text-xs text-slate-400 dark:text-white/40 mt-0.5">
              Latest entries from the connected catalog
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-200 rounded-lg text-xs"
          >
            <Link to="/books">
              View all
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>

        <div className="px-5 py-5">
          {isLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[180px] max-w-[180px] animate-pulse"
                >
                  <div className="h-[270px] rounded-[26px] bg-slate-100 dark:bg-white/8" />
                  <div className="mt-3 h-3 w-4/5 rounded bg-slate-100 dark:bg-white/8" />
                  <div className="mt-2 h-3 w-3/5 rounded bg-slate-100 dark:bg-white/6" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-10 text-center">
              <p className="text-sm text-rose-500">
                {error instanceof Error
                  ? error.message
                  : "Unable to load books."}
              </p>
            </div>
          ) : books.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-400">
                No books in the catalog yet.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-300"
              >
                <Link to="/books?create=true">Add your first book</Link>
              </Button>
            </div>
          ) : (
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {books.map((book) => (
                <RecentBookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>

        {!isLoading && !isError && books.length > 0 ? (
          <div className="border-t border-slate-100 dark:border-white/8 px-5 py-3 bg-slate-50/50 dark:bg-white/4">
            <p className="text-xs text-slate-400 dark:text-white/40">
              Showing {books.length} of {totalItems} books
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
