import { CheckCircle2, CircleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type ToastVariant = "error" | "success";

export type ToastItem = {
  description?: string;
  id: string;
  title: string;
  variant: ToastVariant;
};

type ToastProps = {
  item: ToastItem;
  onDismiss: (id: string) => void;
};

export function Toast({ item, onDismiss }: ToastProps) {
  const isSuccess = item.variant === "success";

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[24px] border px-4 py-4 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.9)] backdrop-blur",
        isSuccess
          ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
          : "border-rose-200 bg-rose-50/95 text-rose-900",
      )}
      role="status"
    >
      <div
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl",
          isSuccess ? "bg-emerald-100" : "bg-rose-100",
        )}
      >
        {isSuccess ? (
          <CheckCircle2 className="size-4" />
        ) : (
          <CircleAlert className="size-4" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{item.title}</p>
        {item.description ? (
          <p className="mt-1 text-sm leading-6 opacity-80">{item.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        className="rounded-full p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
        onClick={() => onDismiss(item.id)}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
