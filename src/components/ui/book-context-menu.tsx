import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BookMarked,
  CheckCircle2,
  EllipsisVertical,
  FolderPlus,
  Pencil,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useBookLists, type BookListKey } from "@/hooks/use-book-lists";

type BookContextMenuProps = {
  bookId: string;
  onEdit: () => void;
  onDelete: () => void;
  /** Optional extra class on the trigger button */
  triggerClassName?: string;
};

const listActions: { key: BookListKey; icon: typeof BookMarked; label: string; activeLabel: string }[] = [
  {
    key: "want-to-read",
    icon: BookMarked,
    label: "Add to Want to Read",
    activeLabel: "Remove from Want to Read",
  },
  {
    key: "collection",
    icon: FolderPlus,
    label: "Add to Collection",
    activeLabel: "Remove from Collection",
  },
  {
    key: "finished",
    icon: CheckCircle2,
    label: "Mark as Finished",
    activeLabel: "Unmark as Finished",
  },
];

export function BookContextMenu({
  bookId,
  onEdit,
  onDelete,
  triggerClassName,
}: BookContextMenuProps) {
  const { toggle, isIn } = useBookLists();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 216;
    const spaceRight = window.innerWidth - rect.right;
    const left =
      spaceRight >= menuWidth ? rect.left : Math.max(8, rect.right - menuWidth);
    setMenuPos({ top: rect.bottom + 6, left });
    setOpen((v) => !v);
  };

  // Close on outside click / scroll
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | Event) => {
      if (
        e instanceof MouseEvent &&
        menuRef.current?.contains(e.target as Node)
      )
        return;
      if (
        e instanceof MouseEvent &&
        triggerRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Book options"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={openMenu}
        className={cn(
          "flex size-7 items-center justify-center rounded-full transition-colors",
          "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
          "dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/80",
          open && "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80",
          triggerClassName,
        )}
      >
        <EllipsisVertical className="size-4" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: menuPos.top, left: menuPos.left }}
            className="fixed z-[200] w-[216px] overflow-hidden rounded-[14px] border border-slate-200/80 bg-white/95 shadow-[0_8px_32px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/95 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            {/* List actions */}
            <div className="px-1 py-1">
              {listActions.map(({ key, icon: Icon, label, activeLabel }) => {
                const active = isIn(key, bookId);
                return (
                  <button
                    key={key}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      toggle(key, bookId);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[0.82rem] font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/8"
                  >
                    <Icon
                      className={cn(
                        "size-4 flex-none",
                        active
                          ? "text-indigo-500 dark:text-indigo-400"
                          : "text-slate-400 dark:text-slate-500",
                      )}
                    />
                    {active ? activeLabel : label}
                    {active && (
                      <span className="ml-auto size-1.5 rounded-full bg-indigo-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="mx-3 border-t border-slate-100 dark:border-white/8" />

            {/* Edit / Delete */}
            <div className="px-1 py-1">
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  onEdit();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[0.82rem] font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/8"
              >
                <Pencil className="size-4 flex-none text-slate-400 dark:text-slate-500" />
                Edit
              </button>
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[0.82rem] font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <Trash2 className="size-4 flex-none" />
                Delete
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
