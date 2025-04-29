
import { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "@/routes";
import { Toaster } from "sonner";
import PageLoader from "@/components/PageLoader";

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Component that renders routes
function AppRoutes() {
  return useRoutes(routes);
}

// Main application component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
