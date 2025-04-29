
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import PageLoader from "@/components/PageLoader";
import { AuthProvider } from "@/hooks/auth/auth-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <AppRoutes />
          </Suspense>
          <Toaster />
          <SonnerToaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
