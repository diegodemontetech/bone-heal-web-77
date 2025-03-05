
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from '@/hooks/use-auth-context';
import RoutesComponent from './Routes';

// Criar query client para o TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    // Definir o título da página
    document.title = 'Bone Heal - Membrana Regenerativa Odontológica';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <RoutesComponent />
        </BrowserRouter>
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
