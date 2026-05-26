import { NavLink, Outlet, useMatches } from "react-router-dom";
import {
  Bell,
  BookMarked,
  BookOpenText,
  ChartColumnBig,
  ChevronRight,
  Menu,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Overview", icon: ChartColumnBig, to: "/" },
  { label: "Books", icon: BookOpenText, to: "/books" },
];

export function AppLayout() {
  const matches = useMatches();
  const activeMatch = [...matches]
    .reverse()
    .find((match) => Boolean((match.handle as { title?: string } | undefined)?.title));
  const currentTitle = (activeMatch?.handle as { title?: string } | undefined)?.title ?? "Book System";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.10),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.14),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_48%,_#fff7ed_100%)] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-[1580px] gap-6 px-4 py-4 xl:grid-cols-[300px_1fr] xl:px-6 xl:py-6">
        <aside className="flex flex-col overflow-hidden rounded-[34px] border border-white/60 bg-[linear-gradient(180deg,_#0f172a_0%,_#131f38_55%,_#1e1b4b_100%)] px-5 py-6 text-slate-100 shadow-[0_45px_120px_-65px_rgba(15,23,42,1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/10">
                <BookMarked className="size-5 text-amber-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
                  Nexgensis
                </p>
                <h1 className="text-lg font-semibold">Book System</h1>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex rounded-2xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white xl:hidden"
            >
              <Menu className="size-4" />
            </button>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Today
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Curate the catalog with real structure.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Move from a passive dashboard into an actual management workflow:
              browse, inspect, add, and edit books.
            </p>
            <Button
              asChild
              className="mt-5 w-full rounded-2xl bg-white text-slate-950 hover:bg-slate-100"
              size="lg"
            >
              <NavLink to="/books">
                <Plus className="size-4" />
                Open catalog
              </NavLink>
            </Button>
          </div>

          <nav className="mt-8 space-y-2">
            {navigationItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
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

          <div className="mt-auto rounded-[28px] border border-white/10 bg-white/6 p-5">
            <p className="text-sm font-medium text-white">Build Progress</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-[linear-gradient(90deg,_#fb7185,_#f59e0b,_#818cf8)]" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Shell, service layer, live catalog, search, filters, detail view,
              and local CRUD are now active.
            </p>
          </div>
        </aside>

        <main className="min-w-0 overflow-hidden rounded-[36px] border border-white/60 bg-white/72 shadow-[0_45px_120px_-70px_rgba(15,23,42,0.7)] backdrop-blur-xl">
          <div className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-5 py-4 backdrop-blur-xl md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Workspace</p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {String(currentTitle)}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open notifications"
                  className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <Bell className="size-4" />
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#fb7185,_#818cf8)] text-sm font-semibold text-white">
                    NT
                  </div>
                  <div className="hidden text-left md:block">
                    <p className="text-sm font-medium text-slate-900">Nexgensis Team</p>
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
            className="p-5 md:p-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
