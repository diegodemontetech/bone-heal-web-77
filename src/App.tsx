
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';
import routes from "./Routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
        <Toaster />
        <Sonner position="top-right" />
        <WhatsAppWidget />
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;
