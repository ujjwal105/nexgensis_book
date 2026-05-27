import {
  ArrowRight,
  BookCopy,
  Boxes,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useBooks } from "@/hooks/use-books";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      iconColor: "text-indigo-600 dark:text-emerald-300",
      iconBg: "bg-indigo-50 dark:bg-emerald-400/10",
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
    {
      label: "Status",
      value: "Live",
      sub: "all systems normal",
      icon: Sparkles,
      iconColor: "text-amber-600 dark:text-amber-300",
      iconBg: "bg-amber-50 dark:bg-amber-500/10",
      trend: "100% uptime",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white/90 tracking-tight">
            Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/60">
            Your book catalog at a glance.
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-300 shadow-sm"
        >
          <Link to="/books">
            Browse catalog
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, sub, icon: Icon, iconColor, iconBg, trend }) => (
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
                <p className="mt-1 text-xs text-slate-400 dark:text-white/40">{sub}</p>
              </div>
              <div className={cn("flex size-9 flex-none items-center justify-center rounded-lg", iconBg)}>
                <Icon className={cn("size-4", iconColor)} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/60">
              <TrendingUp className="size-3 text-emerald-500" />
              <span>{trend}</span>
            </div>
          </div>
        ))}
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
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-emerald-300 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-200 rounded-lg text-xs"
          >
            <Link to="/books">
              View all
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/8">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="size-9 rounded-lg bg-slate-100 dark:bg-white/8 animate-pulse flex-none" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="h-3 bg-slate-100 dark:bg-white/8 rounded animate-pulse w-2/5" />
                  <div className="h-3 bg-slate-100 dark:bg-white/8 rounded animate-pulse w-1/4" />
                </div>
                <div className="h-5 w-16 bg-slate-100 dark:bg-white/8 rounded-full animate-pulse hidden sm:block" />
              </div>
            ))
          ) : isError ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-rose-500">
                {error instanceof Error ? error.message : "Unable to load books."}
              </p>
            </div>
          ) : books.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-slate-400">No books in the catalog yet.</p>
              <Button
                asChild
                size="sm"
                className="mt-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-300"
              >
                <Link to="/books?create=true">Add your first book</Link>
              </Button>
            </div>
          ) : (
            books.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/6 transition-colors group"
              >
                <div
                  className="flex size-9 flex-none items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: book.coverColor }}
                >
                  {book.title.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white/90 truncate group-hover:text-indigo-600 dark:group-hover:text-emerald-300 transition-colors">
                    {book.title}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-white/40 truncate mt-0.5">
                    {book.author} · {book.publicationYear}
                  </p>
                </div>
                <span
                  className="hidden sm:inline-flex flex-none rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold text-white"
                  style={{ backgroundColor: book.coverColor }}
                >
                  {book.genre}
                </span>
                <ChevronRight className="size-3.5 text-slate-300 dark:text-white/30 group-hover:text-slate-400 dark:group-hover:text-white/45 flex-none transition-colors" />
              </Link>
            ))
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

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/books?create=true"
          className="group flex items-center gap-4 rounded-xl border border-dashed border-slate-300 dark:border-white/10 bg-white dark:bg-[#232324] p-4 text-sm transition-all hover:border-indigo-300 dark:hover:border-emerald-300/30 hover:bg-indigo-50/30 dark:hover:bg-emerald-400/8"
        >
          <div className="flex size-9 flex-none items-center justify-center rounded-lg bg-indigo-50 dark:bg-emerald-400/10 text-indigo-600 group-hover:bg-indigo-100 dark:group-hover:bg-emerald-400/18 transition-colors">
            <BookCopy className="size-4" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white/90">Add a book</p>
            <p className="text-xs text-slate-400 dark:text-white/40 mt-0.5">
              Create a new catalog entry
            </p>
          </div>
          <ArrowRight className="size-4 text-slate-300 dark:text-white/30 group-hover:text-indigo-400 dark:group-hover:text-emerald-300 ml-auto flex-none transition-colors" />
        </Link>
        <Link
          to="/books"
          className="group flex items-center gap-4 rounded-xl border border-dashed border-slate-300 dark:border-white/10 bg-white dark:bg-[#232324] p-4 text-sm transition-all hover:border-slate-400 dark:hover:border-white/16 hover:bg-slate-50 dark:hover:bg-white/8"
        >
          <div className="flex size-9 flex-none items-center justify-center rounded-lg bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-white/60 group-hover:bg-slate-200 dark:group-hover:bg-white/12 transition-colors">
            <Boxes className="size-4" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white/90">Browse catalog</p>
            <p className="text-xs text-slate-400 dark:text-white/40 mt-0.5">
              Search and filter all books
            </p>
          </div>
          <ArrowRight className="size-4 text-slate-300 dark:text-white/30 group-hover:text-slate-500 ml-auto flex-none transition-colors" />
        </Link>
      </div>
    </div>
  );
}
