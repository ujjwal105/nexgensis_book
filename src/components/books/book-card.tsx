import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Pencil, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import type { Book } from "@/types/book";

type BookCardProps = {
  book: Book;
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
};

export function BookCard({ book, onDelete, onEdit }: BookCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const titleInitial = book.title.charAt(0).toUpperCase();
  const hasCoverImage = Boolean(book.coverImage) && !imageFailed;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 h-full">
        {/* Cover */}
        <Link
          to={`/books/${book.id}`}
          className="block flex-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
          title={book.title}
        >
          <div
            className="relative h-[88px] overflow-hidden"
            style={{ backgroundColor: book.coverColor }}
          >
            {hasCoverImage ? (
              <>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={() => setImageFailed(true)}
                />
                <div className="absolute inset-0 bg-black/20" />
              </>
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.18), transparent 50%)",
                }}
              />
            )}
            <div className="absolute bottom-3 left-4 flex size-9 items-center justify-center rounded-lg bg-black/25 text-base font-bold text-white ring-1 ring-white/20 backdrop-blur-[2px]">
              {titleInitial}
            </div>
          </div>
        </Link>

        {/* Body */}
        <div className="flex flex-1 flex-col px-4 pt-3.5 pb-3">
          <div className="flex-1">
            <Link to={`/books/${book.id}`} className="block group/title">
              <h3 className="line-clamp-2 text-[0.9rem] font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-100 group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors">
                {book.title}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-1 text-xs text-slate-400 dark:text-slate-500">
              {book.author}
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="inline-flex rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[0.68rem] font-medium text-slate-500 dark:text-slate-400">
                {book.publicationYear}
              </span>
              <span
                className="inline-flex rounded-md px-2 py-0.5 text-[0.68rem] font-semibold text-white"
                style={{ backgroundColor: book.coverColor }}
              >
                {book.genre}
              </span>
            </div>

            <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {book.description}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            <AnimatePresence mode="wait">
              {isConfirmingDelete ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-900/20 px-3 py-2">
                    <span className="text-xs text-rose-700 dark:text-rose-400 font-medium">
                      Delete this book?
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 rounded-md px-2 text-xs text-slate-500 hover:bg-white dark:hover:bg-slate-800"
                        onClick={() => setIsConfirmingDelete(false)}
                      >
                        <X className="size-3" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 rounded-md px-2.5 text-xs bg-rose-500 text-white hover:bg-rose-600"
                        onClick={() => onDelete(book.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 flex-1 rounded-md text-xs text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                      onClick={() => onEdit(book)}
                    >
                      <Pencil className="size-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 flex-1 rounded-md text-xs text-slate-500 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      onClick={() => setIsConfirmingDelete(true)}
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </Button>
                    <Link
                      to={`/books/${book.id}`}
                      className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      title="View details"
                    >
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
