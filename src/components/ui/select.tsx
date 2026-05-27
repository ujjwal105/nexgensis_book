import * as React from "react";

import { cn } from "@/lib/utils";

function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors outline-none hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/8 dark:border-white/10 dark:text-white/90 dark:hover:border-white/16 dark:focus:border-emerald-300 dark:focus:ring-emerald-300/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { Select };
