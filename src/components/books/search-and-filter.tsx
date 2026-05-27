import { Search, SlidersHorizontal, X } from "lucide-react";
import type { RefObject } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { genreOptions } from "@/lib/constants";

type SearchAndFilterProps = {
  genre: string;
  hasActiveFilters: boolean;
  searchInputRef?: RefObject<HTMLInputElement | null>;
  resultsCount: number;
  search: string;
  onClearFilters: () => void;
  onGenreChange: (value: string) => void;
  onSearchChange: (value: string) => void;
};

export function SearchAndFilter({
  genre,
  hasActiveFilters,
  searchInputRef,
  resultsCount,
  search,
  onClearFilters,
  onGenreChange,
  onSearchChange,
}: SearchAndFilterProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-3 shadow-sm">
      <div className="grid gap-2 lg:grid-cols-[1fr_220px_auto] lg:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            ref={searchInputRef}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or author..."
            className="pl-9"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <Select
            value={genre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="pl-9"
          >
            <option value="">All genres</option>
            {genreOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </div>

        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 lg:justify-self-end"
            onClick={onClearFilters}
          >
            <X className="size-3.5" />
            Clear
          </Button>
        ) : null}
      </div>

      <div className="mt-2.5 px-0.5 text-[0.72rem] text-slate-400 dark:text-slate-500">
        {resultsCount} {resultsCount === 1 ? "book" : "books"} found
        {hasActiveFilters ? (
          <span className="ml-1.5 text-indigo-500">· filtered</span>
        ) : null}
      </div>
    </div>
  );
}
