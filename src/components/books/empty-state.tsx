import { BookX, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  hasFilters?: boolean;
  onAction: () => void;
};

export function EmptyState({ hasFilters = false, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 px-6 py-14 text-center shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)]">
      <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
        <BookX className="size-7" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-slate-950">
        {hasFilters ? "No books match these filters" : "Your catalog is empty"}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Adjust your search or genre filters to widen the results."
          : "Add your first custom book to start building the collection."}
      </p>
      <Button
        className="mt-6 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700"
        size="lg"
        onClick={onAction}
      >
        <Plus className="size-4" />
        Add book
      </Button>
    </div>
  );
}
