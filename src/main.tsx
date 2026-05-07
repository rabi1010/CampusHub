import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "./Component/ui/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch on window focus during development
      refetchOnWindowFocus: false,
      // Retry once on failure before showing error
      retry: 1,
      // Data is fresh for 30 seconds
      staleTime: 30_000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {" "}
          {/* ← add this */}
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </ToastProvider>{" "}
        {/* ← and this */}
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
