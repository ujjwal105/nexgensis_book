import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookMarked,
  BookOpenText,
  ChartColumnBig,
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
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
  { label: "Overview", icon: ChartColumnBig, to: "/overview" },
  { label: "Books", icon: BookOpenText, to: "/books" },
];

function LibraryNavItem({
  icon: Icon,
  label,
  to,
  count,
  collapsed = false,
}: {
  icon: React.ElementType;
  label: string;
  to: string;
  count?: number;
  collapsed?: boolean;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "mb-0.5 flex items-center rounded-lg py-2 text-[0.82rem] font-medium transition-colors",
        collapsed ? "justify-center px-0" : "gap-2.5 px-2.5",
        isActive
          ? "bg-slate-100 text-slate-900 dark:bg-white/8 dark:text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/6 dark:hover:text-white/85",
      )}
    >
      <Icon
        className={cn(
          collapsed ? "size-[18px] flex-none" : "size-3.5 flex-none",
          isActive ? "text-emerald-500 dark:text-emerald-300" : "text-slate-400 dark:text-white/40",
        )}
      />
      <span className={cn("flex-1", collapsed && "hidden")}>{label}</span>
      {count !== undefined && count > 0 && !collapsed && (
        <span className="ml-auto flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-emerald-100 px-1 text-[0.62rem] font-semibold text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
          {count}
        </span>
      )}
    </Link>
  );
}

const mobileNavigationItems = [
  { label: "Overview", icon: ChartColumnBig, to: "/overview" },
  { label: "Add", icon: Plus, to: { pathname: "/books", search: "?create=true" } },
  { label: "Books", icon: BookOpenText, to: "/books" },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { counts } = useBookLists();
  const isSearchRoute = location.pathname === "/search";
  const isBooksTabActive = location.pathname.startsWith("/books");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("sidebar-collapsed") === "true";
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      "sidebar-collapsed",
      isSidebarCollapsed ? "true" : "false",
    );
  }, [isSidebarCollapsed]);

  const sidebarWidth = isSidebarCollapsed ? 72 : 220;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1c1c1d]">
      {/* Sidebar — fixed, desktop only */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-200 bg-white transition-[width] duration-200 md:flex dark:border-white/8 dark:bg-[#1c1c1d]"
        style={{ width: sidebarWidth }}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex flex-none items-center border-b border-slate-200 py-4 dark:border-white/8",
            isSidebarCollapsed ? "justify-center px-2" : "gap-2.5 px-4",
          )}
        >
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/12 ring-1 ring-emerald-400/20 dark:bg-emerald-400/15 dark:ring-emerald-300/25">
            <BookMarked className="size-3.5 text-emerald-500 dark:text-emerald-300" />
          </div>
          <div className={cn("min-w-0", isSidebarCollapsed && "hidden")}>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-white/40">
              Nexgensis
            </p>
            <p className="mt-0.5 truncate text-[0.82rem] font-semibold leading-none text-slate-900 dark:text-white">
              Book System
            </p>
          </div>
        </div>

        {/* Search shortcut */}
        {!isSidebarCollapsed ? (
          <div className="px-3 pt-4 flex-none">
            <button
              type="button"
              onClick={() => navigate("/search")}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors",
                isSearchRoute
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-300"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-white/10 dark:bg-white/6 dark:text-white/60 dark:hover:bg-white/8 dark:hover:text-white/75",
              )}
            >
              <Search
                className={cn(
                  "size-3 flex-none",
                  isSearchRoute && "text-emerald-500 dark:text-emerald-300",
                )}
              />
              <span className="flex-1 text-left">Search...</span>
              <kbd
                className={cn(
                  "inline-flex h-4 items-center rounded border bg-white px-1 text-[0.6rem] font-medium dark:bg-white/6",
                  isSearchRoute
                    ? "border-emerald-200 text-emerald-400 dark:border-emerald-300/25 dark:text-emerald-300"
                    : "border-slate-200 text-slate-400 dark:border-white/10 dark:text-white/40",
                )}
              >
                ⌘K
              </kbd>
            </button>
          </div>
        ) : null}

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto py-3 space-y-4",
            isSidebarCollapsed ? "px-2" : "px-3",
          )}
        >
          {/* Main */}
          <div>
            {!isSidebarCollapsed && (
              <p className="mb-1.5 px-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-white/30">
                Menu
              </p>
            )}
            <div>
              {navigationItems.map(({ label, icon: Icon, to }) => {
                const isActive =
                  label === "Books"
                    ? isBooksTabActive
                    : location.pathname === to;
                return (
                  <Link
                    key={label}
                    to={to}
                    className={cn(
                      "mb-0.5 flex items-center py-2 text-[0.82rem] font-medium transition-colors",
                      isSidebarCollapsed ? "justify-center px-0" : "gap-2.5 px-2.5",
                      isActive
                        ? "bg-slate-100 text-slate-900 dark:bg-white/8 dark:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/6 dark:hover:text-white/85",
                    )}
                  >
                    <Icon
                      className={cn(
                        isSidebarCollapsed ? "size-[18px] flex-none" : "size-3.5 flex-none",
                        isActive
                          ? "text-emerald-500 dark:text-emerald-300"
                          : "text-slate-400 dark:text-white/40",
                      )}
                    />
                    {!isSidebarCollapsed && <span>{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Library */}
          <div>
            {!isSidebarCollapsed && (
              <p className="mb-1.5 px-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-white/30">
                Library
              </p>
            )}
            <div
              className={cn(
                isSidebarCollapsed && "mt-3 border-t border-slate-200 pt-3 dark:border-white/8",
              )}
            >
              <LibraryNavItem
                icon={LayoutGrid}
                label="All Books"
                to="/books/all"
                collapsed={isSidebarCollapsed}
              />
              <LibraryNavItem
                icon={BookMarked}
                label="Want to Read"
                to="/books/want-to-read"
                count={counts["want-to-read"]}
                collapsed={isSidebarCollapsed}
              />
              <LibraryNavItem
                icon={CheckCircle2}
                label="Finished"
                to="/books/finished"
                count={counts.finished}
                collapsed={isSidebarCollapsed}
              />
              <LibraryNavItem
                icon={FolderPlus}
                label="My Samples"
                to="/books/my-samples"
                collapsed={isSidebarCollapsed}
              />
            </div>
          </div>

        </nav>

        {/* Theme toggle + User */}
        <div className="flex-none border-t border-slate-200 dark:border-white/8">
          {/* Theme toggle */}
          <div className={cn("pt-3", isSidebarCollapsed ? "px-2" : "px-3")}>
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className={cn(
                "flex w-full items-center rounded-lg py-2 text-[0.82rem] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/6 dark:hover:text-white/85",
                isSidebarCollapsed ? "justify-center px-0" : "gap-2.5 px-2.5",
              )}
            >
              {isSidebarCollapsed ? (
                theme === "dark" ? (
                  <Sun className="size-4 flex-none text-amber-400" />
                ) : (
                  <Moon className="size-4 flex-none text-slate-400 dark:text-white/60" />
                )
              ) : theme === "dark" ? (
                <>
                  <Sun className="size-4 flex-none text-amber-400" />
                  <span className={cn(isSidebarCollapsed && "hidden")}>Light mode</span>
                </>
              ) : (
                <>
                  <Moon className="size-4 flex-none text-slate-400" />
                  <span className={cn(isSidebarCollapsed && "hidden")}>Dark mode</span>
                </>
              )}
              {isSidebarCollapsed ? null : (
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
              )}
            </button>
          </div>

          <div className={cn("px-3 py-3", isSidebarCollapsed && "px-2")}>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((v) => !v)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg py-2 text-[0.82rem] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/6 dark:hover:text-white/85",
                isSidebarCollapsed ? "justify-center px-0" : "px-2.5",
              )}
            >
              {isSidebarCollapsed ? (
                <ChevronsRight className="size-4 flex-none text-emerald-500 dark:text-emerald-300" />
              ) : (
                <ChevronsLeft className="size-4 flex-none text-emerald-500 dark:text-emerald-300" />
              )}
              <span className={cn(isSidebarCollapsed && "hidden")}>
                {isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Content — offset by sidebar width on desktop only */}
      <div
        className={cn(
          "flex min-h-screen flex-col bg-slate-50 dark:bg-[#1c1c1d] transition-[padding-left] duration-200",
          isSidebarCollapsed ? "md:pl-[72px]" : "md:pl-[220px]",
        )}
      >
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
            <Link
              key={label}
              to={to}
              aria-label={label}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl px-5 py-2 text-[0.68rem] font-semibold transition-colors",
                label === "Add"
                  ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-zinc-950"
                  : label === "Books"
                    ? isBooksTabActive
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-white/75"
                    : location.pathname === to
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-white/75",
              )}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
