import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      closeButton
      position="top-right"
      richColors
      toastOptions={{
        className:
          "border border-slate-200 bg-white text-slate-900 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.9)] dark:border-white/10 dark:bg-[#232324] dark:text-white",
      }}
    />
  );
}
