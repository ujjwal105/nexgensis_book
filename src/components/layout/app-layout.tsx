import React from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookMarked,
  BookOpenText,
  ChartColumnBig,
  CheckCircle2,
  FolderPlus,
  LayoutGrid,
  Moon,
  Plus,
  Search,
  Sun,
} from "lucide-react";

import { useBookLists } from "@/hooks/use-book-lists";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const navigationItems = [
  { label: "Overview", icon: ChartColumnBig, to: "/" },
  { label: "Books", icon: BookOpenText, to: "/books" },
];

function LibraryNavItem({
  icon: Icon,
  label,
  to,
  listParam,
  count,
}: {
  icon: React.ElementType;
  label: string;
  to: string;
  /** URL ?list= value — undefined means "All Books" (no param) */
  listParam?: string;
  count?: number;
}) {
  const location = useLocation();
  const currentList = new URLSearchParams(location.search).get("list");

  // Exact match: if this item has a listParam, active only when ?list matches.
  // "All Books" (no listParam) is active only when on /books with NO list param.
  const isActive = listParam
    ? location.pathname === "/books" && currentList === listParam
    : location.pathname === "/books" && !currentList;

  const href = listParam ? `${to}?list=${listParam}` : to;

  return (
    <Link
      to={href}
      className={cn(
        "mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.82rem] font-medium transition-colors",
        isActive
          ? "bg-slate-100 text-slate-900 dark:bg-white/8 dark:text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/6 dark:hover:text-white/85",
      )}
    >
      <Icon
        className={cn(
          "size-3.5 flex-none",
          isActive ? "text-indigo-500 dark:text-emerald-300" : "text-slate-400 dark:text-white/40",
        )}
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-auto flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-indigo-100 px-1 text-[0.62rem] font-semibold text-indigo-600 dark:bg-emerald-400/15 dark:text-emerald-300">
          {count}
        </span>
      )}
    </Link>
  );
}

const mobileNavigationItems = [
  { label: "Overview", icon: ChartColumnBig, to: "/" },
  { label: "Add", icon: Plus, to: { pathname: "/books", search: "?create=true" } },
  { label: "Books", icon: BookOpenText, to: "/books" },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { counts } = useBookLists();
  const isSearchRoute = location.pathname === "/search";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1c1c1d]">
      {/* Sidebar — fixed, desktop only */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col border-r border-slate-200 bg-white md:flex dark:border-white/8 dark:bg-[#1c1c1d]">
        {/* Logo */}
        <div className="flex flex-none items-center gap-2.5 border-b border-slate-200 px-4 py-4 dark:border-white/8">
          <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/12 ring-1 ring-indigo-400/20 dark:bg-emerald-400/15 dark:ring-emerald-300/25">
            <BookMarked className="size-3.5 text-indigo-500 dark:text-emerald-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-white/40">
              Nexgensis
            </p>
            <p className="mt-0.5 truncate text-[0.82rem] font-semibold leading-none text-slate-900 dark:text-white">
              Book System
            </p>
          </div>
        </div>

        {/* Search shortcut */}
        <div className="px-3 pt-4 flex-none">
          <button
            type="button"
            onClick={() => navigate("/search")}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors",
              isSearchRoute
                ? "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-300"
                : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-white/10 dark:bg-white/6 dark:text-white/60 dark:hover:bg-white/8 dark:hover:text-white/75",
            )}
          >
            <Search
              className={cn(
                "size-3 flex-none",
                isSearchRoute && "text-indigo-500 dark:text-emerald-300",
              )}
            />
            <span className="flex-1 text-left">Search...</span>
            <kbd
              className={cn(
                "inline-flex h-4 items-center rounded border bg-white px-1 text-[0.6rem] font-medium dark:bg-white/6",
                isSearchRoute
                  ? "border-indigo-200 text-indigo-400 dark:border-emerald-300/25 dark:text-emerald-300"
                  : "border-slate-200 text-slate-400 dark:border-white/10 dark:text-white/40",
              )}
            >
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Main */}
          <div>
            <p className="mb-1.5 px-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-white/30">
              Menu
            </p>
            {navigationItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.82rem] font-medium transition-colors",
                    isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-white/8 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/6 dark:hover:text-white/85",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "size-3.5 flex-none",
                        isActive ? "text-indigo-500 dark:text-emerald-300" : "text-slate-400 dark:text-white/40",
                      )}
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Library */}
          <div>
            <p className="mb-1.5 px-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-white/30">
              Library
            </p>
            <LibraryNavItem
              icon={LayoutGrid}
              label="All Books"
              to="/books"
              listParam="all"
            />
            <LibraryNavItem
              icon={BookMarked}
              label="Want to Read"
              to="/books"
              listParam="want-to-read"
              count={counts["want-to-read"]}
            />
            <LibraryNavItem
              icon={CheckCircle2}
              label="Finished"
              to="/books"
              listParam="finished"
              count={counts.finished}
            />
            <LibraryNavItem
              icon={FolderPlus}
              label="My Samples"
              to="/books"
              listParam="my-samples"
            />
          </div>

        </nav>

        {/* Theme toggle + User */}
        <div className="flex-none border-t border-slate-200 dark:border-white/8">
          {/* Theme toggle */}
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={toggle}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.82rem] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/6 dark:hover:text-white/85"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="size-3.5 flex-none text-amber-400" />
                  <span>Light mode</span>
                </>
              ) : (
                <>
                  <Moon className="size-3.5 flex-none text-slate-400" />
                  <span>Dark mode</span>
                </>
              )}
              {/* Toggle pill */}
              <div
                className={cn(
                  "ml-auto flex h-5 w-9 items-center rounded-full border transition-colors",
                  theme === "dark"
                    ? "border-emerald-300/45 bg-emerald-400/20"
                    : "border-slate-300 bg-slate-200",
                )}
              >
                <div
                  className={cn(
                    "size-3.5 rounded-full bg-white shadow-sm transition-transform dark:bg-white",
                    theme === "dark" ? "translate-x-[18px]" : "translate-x-0.5",
                  )}
                />
              </div>
            </button>
          </div>

          {/* User */}
          <div className="px-3 py-3">
            <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-white/6">
              <div className="flex size-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-sky-400 text-[0.65rem] font-bold text-zinc-950">
                NT
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.78rem] font-medium leading-none text-slate-900 dark:text-white">
                  Nexgensis Team
                </p>
                <p className="mt-0.5 truncate text-[0.65rem] text-slate-500">
                  Product workspace
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Content — offset by sidebar width on desktop */}
      <div className="md:pl-[220px] flex flex-col min-h-screen bg-slate-50 dark:bg-[#1c1c1d]">
        {/* Page content */}
        <main className="flex-1 bg-slate-50 dark:bg-[#1c1c1d]">
          <motion.div
            key={location.pathname + location.search}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="p-5 pt-6 pb-24 md:p-6 md:pt-6 md:pb-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm px-4 py-2 dark:bg-[#1c1c1d]/95 dark:border-white/8 md:hidden">
        <nav className="flex justify-around">
          {mobileNavigationItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl px-5 py-2 text-[0.68rem] font-semibold transition-colors",
                  label === "Add"
                    ? "bg-indigo-600 text-white dark:bg-emerald-400 dark:text-zinc-950"
                    : isActive
                      ? "text-indigo-600 dark:text-emerald-300"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-white/75",
                )
              }
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
