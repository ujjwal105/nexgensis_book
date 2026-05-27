import { lazy } from "react";

export const LazyDashboardPage = lazy(async () => {
  const module = await import("@/pages/dashboard-page");
  return { default: module.DashboardPage };
});

export const LazyBooksPage = lazy(async () => {
  const module = await import("@/pages/books-page");
  return { default: module.BooksPage };
});

export const LazyBookDetailPage = lazy(async () => {
  const module = await import("@/pages/book-detail-page");
  return { default: module.BookDetailPage };
});

export const LazySearchPage = lazy(async () => {
  const module = await import("@/pages/search-page");
  return { default: module.SearchPage };
});

export const LazyNotFoundPage = lazy(async () => {
  const module = await import("@/pages/not-found-page");
  return { default: module.NotFoundPage };
});
