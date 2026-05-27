import { NavLink, Outlet, useMatches } from "react-router-dom";
import {
  Bell,
  BookMarked,
  BookOpenText,
  ChartColumnBig,
  Moon,
  Plus,
  Search,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const navigationItems = [
  { label: "Overview", icon: ChartColumnBig, to: "/" },
  { label: "Books", icon: BookOpenText, to: "/books" },
];

const mobileNavigationItems = [
  { label: "Overview", icon: ChartColumnBig, to: "/" },
  { label: "Add", icon: Plus, to: { pathname: "/books", search: "?create=true" } },
  { label: "Books", icon: BookOpenText, to: "/books" },
];

export function AppLayout() {
  const matches = useMatches();
  const { theme, toggle } = useTheme();
  const activeMatch = [...matches]
    .reverse()
    .find((match) => Boolean((match.handle as { title?: string } | undefined)?.title));
  const currentTitle =
    (activeMatch?.handle as { title?: string } | undefined)?.title ?? "Book System";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar — fixed, desktop only */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col border-r border-slate-200 bg-white md:flex dark:border-slate-800/50 dark:bg-slate-900">
        {/* Logo */}
        <div className="flex flex-none items-center gap-2.5 border-b border-slate-200 px-4 py-4 dark:border-slate-800/60">
          <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/12 ring-1 ring-indigo-400/20 dark:bg-indigo-500/20 dark:ring-indigo-400/25">
            <BookMarked className="size-3.5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-500">
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
            className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <Search className="size-3 flex-none" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="inline-flex h-4 items-center rounded border border-slate-200 bg-white px-1 text-[0.6rem] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <p className="mb-1.5 px-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-600">
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
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "size-3.5 flex-none",
                      isActive ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500",
                    )}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle + User */}
        <div className="flex-none border-t border-slate-200 dark:border-slate-800/60">
          {/* Theme toggle */}
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={toggle}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.82rem] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
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
                    ? "border-indigo-500/50 bg-indigo-500/30"
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
            <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60">
              <div className="flex size-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-violet-500 text-[0.65rem] font-bold text-white">
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
      <div className="md:pl-[220px] flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-20 flex h-[54px] flex-none items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 dark:bg-slate-900 dark:border-slate-800 md:px-6">
          <h1 className="text-[0.9rem] font-semibold text-slate-800 tracking-tight dark:text-slate-200">
            {String(currentTitle)}
          </h1>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Open notifications"
              className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <Bell className="size-3.5" />
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 hover:bg-slate-100 cursor-pointer transition-colors dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
              <div className="flex size-6 flex-none items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-violet-500 text-[0.6rem] font-bold text-white">
                NT
              </div>
              <p className="hidden text-[0.78rem] font-medium text-slate-700 dark:text-slate-300 md:block">
                Nexgensis
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <motion.div
            key={String(currentTitle)}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="p-5 pb-24 md:p-6 md:pb-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm px-4 py-2 dark:bg-slate-900/95 dark:border-slate-800 md:hidden">
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
                    ? "bg-indigo-600 text-white"
                    : isActive
                      ? "text-indigo-600"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
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
