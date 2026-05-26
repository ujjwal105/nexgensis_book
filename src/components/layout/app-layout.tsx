import { NavLink, Outlet, useMatches } from "react-router-dom";
import {
  Bell,
  BookMarked,
  BookOpenText,
  ChartColumnBig,
  ChevronRight,
  Plus,
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
  const currentTitle = (activeMatch?.handle as { title?: string } | undefined)?.title ?? "Book System";

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-4 px-3 py-3 md:grid-cols-[292px_minmax(0,1fr)] md:gap-6 md:px-6 md:py-6">
        <aside className="hidden h-[calc(100dvh-3rem)] flex-col overflow-hidden rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,_#0f172a_0%,_#131f38_58%,_#1f1f56_100%)] px-6 py-6 text-slate-100 shadow-[0_45px_120px_-65px_rgba(15,23,42,1)] md:sticky md:top-6 md:flex">
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-[18px] bg-white/8 ring-1 ring-white/10">
                <BookMarked className="size-5 text-amber-300" />
              </div>
              <div>
                <p className="text-[0.69rem] font-medium uppercase tracking-[0.32em] text-slate-400">
                  Nexgensis
                </p>
                <h1 className="text-[1.85rem] font-semibold leading-none tracking-[-0.04em]">
                  Book System
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-10 flex min-h-0 flex-1 flex-col">
            <div className="shrink-0">
              <p className="px-2 text-[0.69rem] font-medium uppercase tracking-[0.28em] text-slate-500">
                Navigation
              </p>
            </div>

            <nav className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {navigationItems.map(({ label, icon: Icon, to }) => (
                <NavLink
                  key={label}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-[22px] px-4 py-3.5 text-[0.95rem] font-medium transition",
                      isActive
                        ? "bg-white/12 text-white ring-1 ring-white/10"
                        : "text-slate-300 hover:bg-white/8 hover:text-white",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        <Icon className={cn("size-4", isActive ? "text-amber-300" : "")} />
                        <span>{label}</span>
                      </span>
                      <ChevronRight
                        className={cn(
                          "size-4 transition",
                          isActive ? "text-white" : "text-slate-500",
                        )}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

          </div>
        </aside>

        <main className="min-w-0 overflow-hidden rounded-[28px] border border-white/60 bg-white/76 shadow-[0_45px_120px_-70px_rgba(15,23,42,0.7)] backdrop-blur-xl md:rounded-[36px]">
          <div className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/86 px-4 py-4 backdrop-blur-xl md:px-8 md:py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:text-sm md:normal-case md:tracking-normal">
                  Workspace
                </p>
                <h2 className="text-[1.9rem] font-semibold leading-none tracking-[-0.04em] text-slate-950 md:text-[2.4rem]">
                  {String(currentTitle)}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open notifications"
                  className="inline-flex size-11 items-center justify-center rounded-[18px] border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <Bell className="size-4" />
                </button>
                <div className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                  <div className="flex size-10 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,_#fb7185,_#818cf8)] text-sm font-semibold text-white">
                    NT
                  </div>
                  <div className="hidden text-left md:block">
                    <p className="text-[0.98rem] font-semibold leading-none text-slate-900">
                      Nexgensis Team
                    </p>
                    <p className="text-xs text-slate-500">Product workspace</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            key={String(currentTitle)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="p-4 pb-24 md:p-8 md:pb-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/92 px-3 py-3 backdrop-blur-xl md:hidden">
        <nav className="mx-auto grid max-w-lg grid-cols-3 gap-2 rounded-[26px] border border-slate-200/80 bg-white px-2 py-2 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.8)]">
          {mobileNavigationItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 rounded-[18px] px-3 py-2 text-[0.72rem] font-semibold transition",
                  label === "Add" && "border border-indigo-200/90 bg-indigo-50 text-indigo-700",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : label === "Add"
                      ? "hover:bg-indigo-100 hover:text-indigo-800"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
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
