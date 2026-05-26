import { Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/app-layout";
import { RouteFallback } from "@/components/ui/route-fallback";
import {
  LazyBookDetailPage,
  LazyBooksPage,
  LazyDashboardPage,
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
        path: "books/:id",
        element: withSuspense(<LazyBookDetailPage />),
        handle: {
          title: "Book Details",
        },
      },
    ],
  },
]);
