import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BOOKS_URL = "https://nexgensis-book.vercel.app/books";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/8 dark:bg-[#232324]"
      >
        <div className="relative overflow-hidden px-6 py-10 sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(134,239,172,0.28),_transparent_58%),linear-gradient(135deg,rgba(15,23,42,0.05),transparent_68%)] dark:bg-[radial-gradient(circle_at_top,_rgba(134,239,172,0.16),_transparent_58%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_68%)]" />

          <div className="relative mx-auto flex w-full max-w-md flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="relative mb-8 h-52 w-40"
            >
              <div className="absolute inset-y-2 right-[-10px] w-5 rounded-r-[22px] bg-slate-900/15 blur-[2px] dark:bg-black/35" />
              <div className="absolute inset-0 rounded-[26px] border border-emerald-300/50 bg-[linear-gradient(160deg,#14532d_0%,#22c55e_52%,#bbf7d0_100%)] shadow-[0_24px_50px_rgba(34,197,94,0.25)]" />
              <div className="absolute inset-y-0 left-4 w-px bg-white/35" />
              <div className="absolute inset-x-0 top-0 h-14 rounded-t-[26px] bg-white/12" />
              <div className="absolute inset-x-6 top-8 rounded-2xl border border-white/15 bg-slate-950/18 px-4 py-5 text-left text-white backdrop-blur-sm">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70">
                  Error
                </p>
                <p className="mt-3 text-2xl font-bold tracking-tight">404</p>
                <p className="mt-1 text-sm text-white/78">Page not found</p>
              </div>
            </motion.div>

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">
              Missing Page
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[2.4rem]">
              This page is not in your library.
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-white/58">
              The page you tried to open does not exist. Use the books page
              below to get back into the app.
            </p>

            <a
              href={BOOKS_URL}
              className="mt-7 inline-flex w-full max-w-lg items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-white/10 dark:bg-white/6 dark:text-white/78 dark:hover:border-emerald-300/25 dark:hover:bg-emerald-400/10"
            >
              <span className="truncate">{BOOKS_URL}</span>
              <ExternalLink className="size-4 flex-none text-slate-400 dark:text-white/45" />
            </a>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/books"
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Go to Books
              </Link>
              <Link
                to="/home"
                className="inline-flex items-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:text-white/78 dark:hover:bg-white/8"
              >
                Open Home
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
