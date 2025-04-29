
import { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "@/routes";
import { Toaster } from "sonner";
import PageLoader from "@/components/PageLoader";

// Criação do cliente de consulta
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente que renderiza as rotas
function AppRoutes() {
  return useRoutes(routes);
}

// Componente principal da aplicação
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
