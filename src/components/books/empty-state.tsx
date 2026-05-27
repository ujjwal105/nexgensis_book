import { BookX, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  hasFilters?: boolean;
  onAction: () => void;
};

export function EmptyState({ hasFilters = false, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-white/10 bg-white dark:bg-[#232324] px-6 py-16 text-center shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/8">
        <BookX className="size-5 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {hasFilters ? "No books match your filters" : "No books yet"}
      </h3>
      <p className="mt-1.5 max-w-xs text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
        {hasFilters
          ? "Try adjusting your search or genre filter to find what you're looking for."
          : "Add your first book to start building your catalog."}
      </p>
      <Button
        size="sm"
        className="mt-5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
        onClick={onAction}
      >
        <Plus className="size-3.5" />
        {hasFilters ? "Add a book" : "Add your first book"}
      </Button>
    </div>
  );
}
