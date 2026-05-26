import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Book } from "@/types/book";

type BookCardProps = {
  book: Book;
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
};

export function BookCard({ book, onDelete, onEdit }: BookCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const titleInitial = book.title.charAt(0).toUpperCase();

  return (
    <motion.div layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="h-full overflow-hidden border border-slate-200/70 bg-white/90 py-0 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.9)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
        <Link
          to={`/books/${book.id}`}
          className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
          title={book.title}
        >
          <div
            className="relative h-28 overflow-hidden"
            style={{ backgroundColor: book.coverColor }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.32),_transparent_36%),linear-gradient(135deg,_rgba(15,23,42,0.08),_transparent)]" />
            <div className="absolute bottom-4 left-4 flex size-14 items-center justify-center rounded-3xl bg-white/18 text-2xl font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm">
              {titleInitial}
            </div>
          </div>
        </Link>

        <CardContent className="space-y-4 px-5 py-5">
          <div>
            <Link to={`/books/${book.id}`} className="block">
              <h3 className="line-clamp-2 text-lg font-semibold text-slate-950">
                {book.title}
              </h3>
            </Link>
            <p className="mt-2 line-clamp-1 text-sm text-slate-500">{book.author}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {book.publicationYear}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: book.coverColor }}
            >
              {book.genre}
            </span>
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
            {book.description}
          </p>
        </CardContent>

        <CardFooter className="mt-auto flex flex-col items-stretch gap-3 border-t border-slate-200 bg-slate-50/80 px-5 py-4">
          <AnimatePresence mode="wait">
            {isConfirmingDelete ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <span>Delete this book?</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-600 hover:bg-white"
                      onClick={() => setIsConfirmingDelete(false)}
                    >
                      <X className="size-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-rose-500 text-white hover:bg-rose-600"
                      onClick={() => onDelete(book.id)}
                    >
                      Confirm
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-xl text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                    onClick={() => onEdit(book)}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => setIsConfirmingDelete(true)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
