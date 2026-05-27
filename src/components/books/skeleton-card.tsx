export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#232324] shadow-sm">
      <div className="h-[88px] animate-pulse bg-slate-100 dark:bg-white/8" />
      <div className="px-4 pt-3.5 pb-3 space-y-3">
        <div className="space-y-1.5">
          <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-slate-100 dark:bg-white/8" />
          <div className="h-3 w-1/3 animate-pulse rounded-md bg-slate-100 dark:bg-white/8" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-12 animate-pulse rounded-md bg-slate-100 dark:bg-white/8" />
          <div className="h-5 w-16 animate-pulse rounded-md bg-slate-100 dark:bg-white/8" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded-md bg-slate-100 dark:bg-white/8" />
          <div className="h-3 w-4/5 animate-pulse rounded-md bg-slate-100 dark:bg-white/8" />
        </div>
        <div className="border-t border-slate-100 dark:border-white/8 pt-3">
          <div className="flex gap-1.5">
            <div className="h-7 flex-1 animate-pulse rounded-md bg-slate-100 dark:bg-white/8" />
            <div className="h-7 flex-1 animate-pulse rounded-md bg-slate-100 dark:bg-white/8" />
            <div className="h-7 w-7 animate-pulse rounded-md bg-slate-100 dark:bg-white/8" />
          </div>
        </div>
      </div>
    </div>
  );
}
