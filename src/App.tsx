
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
        <Toaster />
        <Sonner position="top-right" />
        <WhatsAppWidget />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
