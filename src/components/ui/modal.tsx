import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
};

export function Modal({ children, isOpen, onClose, title, description }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm md:flex md:items-center md:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="mx-auto mt-4 flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#232324] shadow-xl md:mt-0 md:max-h-[min(800px,calc(100dvh-2rem))]"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-none items-start justify-between gap-4 border-b border-slate-200 dark:border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
                {description ? (
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-700 dark:hover:text-slate-300"
                onClick={onClose}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-5">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
