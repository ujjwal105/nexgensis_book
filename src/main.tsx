import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import "./index.css";
import { queryClient } from "@/lib/query-client";
import { ToastProvider } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <SonnerToaster />
      </QueryClientProvider>
    </ToastProvider>
  </StrictMode>,
);
