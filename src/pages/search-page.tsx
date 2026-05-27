import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpenText,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useBooks } from "@/hooks/use-books";
import type { Book } from "@/types/book";

function matchesQuery(book: Book, query: string) {
  if (!query) return true;

  return [book.title, book.author, book.genre, book.description]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function getSuggestionPool(books: Book[]) {
  const items = books.flatMap((book) => [book.title, book.author, book.genre]);
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function getTrendingTerms(books: Book[]) {
  const seedTerms = books.flatMap((book) => {
    const titleWords = book.title
      .split(/\s+/)
      .map((word) => word.replace(/[^\w-]/g, ""))
      .filter((word) => word.length > 3);

    return [book.genre, ...titleWords.slice(0, 2)];
  });

  return [...new Set(seedTerms.map((item) => item.trim()).filter(Boolean))].slice(0, 8);
}

function BookStripCard({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex min-w-[220px] items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 transition-colors hover:border-slate-300 hover:bg-white dark:border-white/8 dark:bg-[#232324] dark:hover:border-white/14"
    >
      <div
        className="flex h-20 w-14 flex-none items-end rounded-xl px-2 py-2 text-[0.7rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]"
        style={{ backgroundColor: book.coverColor }}
      >
        <span className="line-clamp-3">{book.title}</span>
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
          {book.title}
        </p>
        <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
          {book.author}
        </p>
        <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
          {book.genre}
        </p>
      </div>
    </Link>
  );
}

function SearchResultRow({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-transparent px-3 py-3 transition-colors hover:border-slate-200 hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-[#232324]/70"
    >
      <div
        className="flex h-24 w-16 flex-none items-end rounded-xl px-2 py-2 text-[0.72rem] font-semibold text-white"
        style={{ backgroundColor: book.coverColor }}
      >
        <span className="line-clamp-4">{book.title}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
          {book.title}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
        <p className="mt-2 line-clamp-2 text-sm text-slate-400 dark:text-slate-500">
          {book.description}
        </p>
      </div>
      <ArrowRight className="size-4 flex-none text-slate-300 transition-colors group-hover:text-slate-500 dark:text-slate-600" />
    </Link>
  );
}

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const queryFromParams = params.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(queryFromParams);
  const skipNextParamSyncRef = useRef(false);
  const deferredSearch = useDeferredValue(searchInput);
  const debouncedUrlSearch = useDebouncedValue(searchInput, 180);
  const query = deferredSearch.trim().toLowerCase();
  const { data, isLoading } = useBooks({ page: 1, limit: 100 });

  const books = data?.data ?? [];
  const suggestionPool = useMemo(() => getSuggestionPool(books), [books]);
  const trendingTerms = useMemo(() => getTrendingTerms(books), [books]);
  const recentBooks = useMemo(() => books.slice(0, 3), [books]);

  useEffect(() => {
    if (skipNextParamSyncRef.current) {
      skipNextParamSyncRef.current = false;
      return;
    }

    setSearchInput(queryFromParams);
  }, [queryFromParams]);

  useEffect(() => {
    const nextQuery = debouncedUrlSearch.trim();

    if (nextQuery === queryFromParams) {
      return;
    }

    skipNextParamSyncRef.current = true;

    const nextParams = new URLSearchParams();

    if (nextQuery) {
      nextParams.set("q", nextQuery);
    }

    setParams(nextParams, { replace: true });
  }, [debouncedUrlSearch, queryFromParams, setParams]);

  const suggestions = useMemo(() => {
    if (!query) return [];

    return suggestionPool
      .filter((item) => item.toLowerCase().includes(query))
      .slice(0, 6);
  }, [query, suggestionPool]);

  const results = useMemo(() => {
    if (!query) return [];
    return books.filter((book) => matchesQuery(book, query));
  }, [books, query]);

  const libraryMatches = results.slice(0, 5);
  const topResults = results.slice(0, 8);
  const hasQuery = Boolean(query);

  return (
    <div className="space-y-8 pb-4">
      <div className="flex justify-center pt-1">
        <div className="relative w-full max-w-[520px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchInput}
            onChange={(event) => {
              const value = event.target.value;
              startTransition(() => setSearchInput(value));
            }}
            placeholder="Search your library"
            className="h-14 rounded-full border-slate-300 bg-white/90 pl-12 pr-12 text-lg shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#232324]/90"
            autoFocus
          />
          {searchInput ? (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-4 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/8 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {hasQuery ? (
        <div className="space-y-8">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-4 text-indigo-500" />
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Suggestions
              </h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/70 dark:border-white/8 dark:bg-[#232324]/70">
              {suggestions.length ? (
                suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setSearchInput(suggestion)}
                    className="flex w-full items-center gap-3 border-b border-slate-200/80 px-4 py-4 text-left text-lg text-slate-600 transition-colors last:border-b-0 hover:bg-slate-50 hover:text-slate-900 dark:border-white/8 dark:text-slate-300 dark:hover:bg-white/8 dark:hover:text-slate-100"
                  >
                    <Search className="size-5 flex-none text-slate-400" />
                    <span>{suggestion}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-5 text-sm text-slate-500 dark:text-slate-400">
                  No suggestions found for "{searchInput}".
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <BookOpenText className="size-4 text-indigo-500" />
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                In Your Library
              </h2>
            </div>
            {libraryMatches.length ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {libraryMatches.map((book) => (
                  <BookStripCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 px-5 py-8 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                No books in your library match "{searchInput}" yet.
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="size-4 text-indigo-500" />
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Top Results
              </h2>
            </div>
            <div className="space-y-1">
              {topResults.length ? (
                topResults.map((book) => <SearchResultRow key={book.id} book={book} />)
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 px-5 py-8 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                  No top results yet. Try a broader keyword.
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-10">
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Recently Added
              </h2>
              <Link
                to="/books"
                className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500"
              >
                Browse all
              </Link>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {recentBooks.map((book) => (
                <BookStripCard key={book.id} book={book} />
              ))}
              {!recentBooks.length && !isLoading ? (
                <div className="rounded-3xl border border-dashed border-slate-300 px-5 py-8 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                  No books available to explore yet.
                </div>
              ) : null}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Trending
              </h2>
              <span className="text-sm text-slate-400 dark:text-slate-500">
                Quick ideas to start searching
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {trendingTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchInput(term)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-4 text-left text-lg text-slate-700 transition-colors hover:border-slate-300 hover:bg-white dark:border-white/8 dark:bg-[#232324]/70 dark:text-slate-300 dark:hover:border-white/14"
                >
                  <Search className="size-5 flex-none text-slate-400" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
