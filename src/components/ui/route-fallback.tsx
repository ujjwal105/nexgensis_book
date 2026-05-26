export function RouteFallback() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="h-6 w-36 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-44 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}
