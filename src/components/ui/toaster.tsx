import { type ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Toast, type ToastItem } from "@/components/ui/toast";
import { ToastContext, type ToastInput } from "@/components/ui/toast-context";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const toast = ({ description, title, variant }: ToastInput) => {
    const id = crypto.randomUUID();

    setItems((current) => [...current, { description, id, title, variant }]);
  };

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const timers = items.map((item) =>
      window.setTimeout(() => {
        dismiss(item.id);
      }, 3200),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [items]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
            >
              <Toast item={item} onDismiss={dismiss} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
