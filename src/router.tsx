import { Suspense, type ReactNode } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/app-layout";
import { RouteFallback } from "@/components/ui/route-fallback";
import {
  LazyBookDetailPage,
  LazyBooksPage,
  LazyDashboardPage,
  LazyNotFoundPage,
  LazySearchPage,
} from "@/pages/lazy-pages";

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{node}</Suspense>;
}

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/books" replace />,
      },
      {
        path: "overview",
        element: withSuspense(<LazyDashboardPage />),
        handle: {
          title: "Overview",
        },
      },
      {
        path: "books",
        element: withSuspense(<LazyBooksPage />),
        handle: {
          title: "Books",
        },
      },
      {
        path: "books/all",
        element: withSuspense(<LazyBooksPage />),
        handle: {
          title: "All Books",
        },
      },
      {
        path: "books/want-to-read",
        element: withSuspense(<LazyBooksPage />),
        handle: {
          title: "Want to Read",
        },
      },
      {
        path: "books/finished",
        element: withSuspense(<LazyBooksPage />),
        handle: {
          title: "Finished",
        },
      },
      {
        path: "books/my-samples",
        element: withSuspense(<LazyBooksPage />),
        handle: {
          title: "My Samples",
        },
      },
      {
        path: "books/:id",
        element: withSuspense(<LazyBookDetailPage />),
        handle: {
          title: "Book Details",
        },
      },
      {
        path: "search",
        element: withSuspense(<LazySearchPage />),
        handle: {
          title: "Search",
        },
      },
    ],
  },
  {
    path: "/not-found",
    element: withSuspense(<LazyNotFoundPage />),
    handle: {
      title: "Page Not Found",
    },
  },
  {
    path: "*",
    element: <Navigate to="/not-found" replace />,
  },
]);
