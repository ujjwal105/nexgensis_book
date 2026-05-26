import { createContext, useContext } from "react";

import type { ToastVariant } from "@/components/ui/toast";

export type ToastInput = {
  description?: string;
  title: string;
  variant: ToastVariant;
};

export type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
