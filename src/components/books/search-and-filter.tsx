import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { genreOptions } from "@/lib/constants";

type SearchAndFilterProps = {
  genre: string;
  hasActiveFilters: boolean;
  resultsCount: number;
  search: string;
  onClearFilters: () => void;
  onGenreChange: (value: string) => void;
  onSearchChange: (value: string) => void;
};

export function SearchAndFilter({
  genre,
  hasActiveFilters,
  resultsCount,
  search,
  onClearFilters,
  onGenreChange,
  onSearchChange,
}: SearchAndFilterProps) {
  return (
    <div className="rounded-[30px] border border-slate-200/70 bg-white/88 p-4 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)] backdrop-blur md:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px_auto] lg:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title or author..."
            className="pl-11"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Select
            value={genre}
            onChange={(event) => onGenreChange(event.target.value)}
            className="pl-11"
          >
            <option value="">All genres</option>
            {genreOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        {hasActiveFilters ? (
          <Button
            variant="ghost"
            className="rounded-2xl text-slate-600 hover:bg-slate-100 lg:justify-self-end"
            onClick={onClearFilters}
          >
            <X className="size-4" />
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="mt-4 text-sm font-medium text-slate-500">Showing {resultsCount} books</div>
    </div>
  );
}
