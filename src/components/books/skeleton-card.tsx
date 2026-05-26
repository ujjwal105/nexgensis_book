export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200/70 bg-white shadow-[0_20px_60px_-50px_rgba(15,23,42,0.9)]">
      <div className="h-28 animate-pulse bg-slate-200" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
