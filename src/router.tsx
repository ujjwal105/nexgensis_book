import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/app-layout";
import { BookDetailPage } from "@/pages/book-detail-page";
import { BooksPage } from "@/pages/books-page";
import { DashboardPage } from "@/pages/dashboard-page";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        handle: {
          title: "Overview",
        },
      },
      {
        path: "books",
        element: <BooksPage />,
        handle: {
          title: "Books",
        },
      },
      {
        path: "books/:id",
        element: <BookDetailPage />,
        handle: {
          title: "Book Details",
        },
      },
    ],
  },
]);
