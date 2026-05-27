import { useState } from "react";

export type BookListKey = "want-to-read" | "finished" | "collection";

function loadLists(): Record<BookListKey, Set<string>> {
  try {
    const raw = localStorage.getItem("book-lists");
    if (raw) {
      const parsed = JSON.parse(raw) as Record<BookListKey, string[]>;
      return {
        "want-to-read": new Set(parsed["want-to-read"] ?? []),
        finished: new Set(parsed["finished"] ?? []),
        collection: new Set(parsed["collection"] ?? []),
      };
    }
  } catch {}
  return {
    "want-to-read": new Set(),
    finished: new Set(),
    collection: new Set(),
  };
}

function saveLists(lists: Record<BookListKey, Set<string>>) {
  localStorage.setItem(
    "book-lists",
    JSON.stringify({
      "want-to-read": [...lists["want-to-read"]],
      finished: [...lists.finished],
      collection: [...lists.collection],
    }),
  );
}

export function useBookLists() {
  const [lists, setLists] = useState<Record<BookListKey, Set<string>>>(loadLists);

  const toggle = (list: BookListKey, bookId: string) => {
    setLists((prev) => {
      const next: Record<BookListKey, Set<string>> = {
        "want-to-read": new Set(prev["want-to-read"]),
        finished: new Set(prev.finished),
        collection: new Set(prev.collection),
      };
      if (next[list].has(bookId)) {
        next[list].delete(bookId);
      } else {
        next[list].add(bookId);
      }
      saveLists(next);
      return next;
    });
  };

  const isIn = (list: BookListKey, bookId: string) => lists[list].has(bookId);

  const counts = {
    "want-to-read": lists["want-to-read"].size,
    finished: lists.finished.size,
    collection: lists.collection.size,
  };

  return { toggle, isIn, counts };
}
