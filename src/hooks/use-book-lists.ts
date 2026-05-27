import { useEffect, useState } from "react";

export type BookListKey = "want-to-read" | "finished" | "collection";

type ToggleResult =
  | { ok: true; action: "added" | "removed" | "moved" }
  | { ok: false; reason: string };

function getOppositeReadingList(list: Exclude<BookListKey, "collection">) {
  return list === "want-to-read" ? "finished" : "want-to-read";
}

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

function emitListsChange() {
  window.dispatchEvent(new Event("book-lists-change"));
}

export function useBookLists() {
  const [lists, setLists] = useState<Record<BookListKey, Set<string>>>(loadLists);

  useEffect(() => {
    const sync = () => {
      setLists(loadLists());
    };

    window.addEventListener("book-lists-change", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("book-lists-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = (list: BookListKey, bookId: string): ToggleResult => {
    const isActive = lists[list].has(bookId);

    if (list === "collection") {
      setLists((prev) => {
        const next: Record<BookListKey, Set<string>> = {
          "want-to-read": new Set(prev["want-to-read"]),
          finished: new Set(prev.finished),
          collection: new Set(prev.collection),
        };
        if (next.collection.has(bookId)) {
          next.collection.delete(bookId);
        } else {
          next.collection.add(bookId);
        }
        saveLists(next);
        emitListsChange();
        return next;
      });

      return { ok: true, action: isActive ? "removed" : "added" };
    }

    const oppositeList = getOppositeReadingList(
      list as Exclude<BookListKey, "collection">,
    );
    const inOppositeList = lists[oppositeList].has(bookId);

    setLists((prev) => {
      const next: Record<BookListKey, Set<string>> = {
        "want-to-read": new Set(prev["want-to-read"]),
        finished: new Set(prev.finished),
        collection: new Set(prev.collection),
      };

      if (next[list].has(bookId)) {
        next[list].delete(bookId);
      } else {
        if (next[oppositeList].has(bookId)) {
          next[oppositeList].delete(bookId);
        }
        next[list].add(bookId);
      }

      saveLists(next);
      emitListsChange();
      return next;
    });

    return {
      ok: true,
      action: isActive ? "removed" : inOppositeList ? "moved" : "added",
    };
  };

  const isIn = (list: BookListKey, bookId: string) => lists[list].has(bookId);

  const counts = {
    "want-to-read": lists["want-to-read"].size,
    finished: lists.finished.size,
    collection: lists.collection.size,
  };

  return { toggle, isIn, counts };
}
