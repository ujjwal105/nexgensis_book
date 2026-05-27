import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/8 dark:border-white/10 dark:text-white/90 dark:placeholder:text-white/35 dark:hover:border-white/16 dark:focus:border-emerald-300 dark:focus:ring-emerald-300/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
