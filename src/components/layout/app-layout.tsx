import { NavLink, Outlet, useMatches } from "react-router-dom";
import {
  Bell,
  BookMarked,
  BookOpenText,
  ChartColumnBig,
  Plus,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

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
  const activeMatch = [...matches]
    .reverse()
    .find((match) => Boolean((match.handle as { title?: string } | undefined)?.title));
  const currentTitle =
    (activeMatch?.handle as { title?: string } | undefined)?.title ?? "Book System";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar — fixed, desktop only */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-[220px] flex-col bg-slate-900 border-r border-slate-800/50">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-800/60 flex-none">
          <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/20 ring-1 ring-indigo-400/25">
            <BookMarked className="size-3.5 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
              Nexgensis
            </p>
            <p className="text-[0.82rem] font-semibold text-white leading-none mt-0.5 truncate">
              Book System
            </p>
          </div>
        </div>

        {/* Search shortcut */}
        <div className="px-3 pt-4 flex-none">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            <Search className="size-3 flex-none" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="inline-flex h-4 items-center rounded border border-slate-700 bg-slate-800 px-1 text-[0.6rem] font-medium text-slate-500">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <p className="px-2 mb-1.5 text-[0.62rem] font-semibold text-slate-600 uppercase tracking-[0.1em]">
            Menu
          </p>
          {navigationItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.82rem] font-medium transition-colors mb-0.5",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "size-3.5 flex-none",
                      isActive ? "text-indigo-400" : "text-slate-500",
                    )}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 border-t border-slate-800/60 pt-3 flex-none">
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-slate-800/60 cursor-pointer transition-colors">
            <div className="flex size-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-violet-500 text-[0.65rem] font-bold text-white">
              NT
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.78rem] font-medium text-white truncate leading-none">
                Nexgensis Team
              </p>
              <p className="text-[0.65rem] text-slate-500 truncate mt-0.5">
                Product workspace
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content — offset by sidebar width on desktop */}
      <div className="md:pl-[220px] flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-20 flex h-[54px] flex-none items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 md:px-6">
          <h1 className="text-[0.9rem] font-semibold text-slate-800 tracking-tight">
            {String(currentTitle)}
          </h1>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Open notifications"
              className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <Bell className="size-3.5" />
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 hover:bg-slate-100 cursor-pointer transition-colors">
              <div className="flex size-6 flex-none items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-violet-500 text-[0.6rem] font-bold text-white">
                NT
              </div>
              <p className="hidden text-[0.78rem] font-medium text-slate-700 md:block">
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
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm px-4 py-2 md:hidden">
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
                      : "text-slate-400 hover:text-slate-700",
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
