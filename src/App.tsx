
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/admin/Products";
import AdminShippingRates from "./pages/admin/ShippingRates";
import AdminNews from "./pages/admin/News";
import AdminWhatsApp from "./pages/admin/Whatsapp";
import AdminWhatsAppMessages from "./pages/admin/WhatsAppMessages";
import AdminLogin from "./pages/AdminLogin";
import AdminStudies from "./pages/admin/Studies";
import Studies from "./pages/Studies";
import Checkout from "./pages/checkout/Checkout";
import Success from "./pages/checkout/Success";
import Failure from "./pages/checkout/Failure";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/admin/Orders";
import AdminEmailTemplates from "./pages/admin/EmailTemplates";
import AdminLeads from "./pages/admin/Leads";
import AdminSync from "./pages/admin/Sync";
import AdminUsers from "./pages/admin/Users";
import AdminSecurity from "./pages/admin/Security";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/products", element: <Products /> },
  { path: "/products/:slug", element: <ProductDetail /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/news", element: <News /> },
  { path: "/news/:slug", element: <NewsDetail /> },
  { path: "/studies", element: <Studies /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/cart", element: <Cart /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/checkout/success", element: <Success /> },
  { path: "/checkout/failure", element: <Failure /> },
  { path: "/profile", element: <Profile /> },
  { path: "/orders", element: <Orders /> },
  { path: "/admin", element: <Admin /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/products", element: <AdminProducts /> },
  { path: "/admin/shipping-rates", element: <AdminShippingRates /> },
  { path: "/admin/news", element: <AdminNews /> },
  { path: "/admin/studies", element: <AdminStudies /> },
  { path: "/admin/whatsapp", element: <AdminWhatsApp /> },
  { path: "/admin/whatsapp-messages", element: <AdminWhatsAppMessages /> },
  { path: "/admin/orders", element: <AdminOrders /> },
  { path: "/admin/email-templates", element: <AdminEmailTemplates /> },
  { path: "/admin/leads", element: <AdminLeads /> },
  { path: "/admin/sync", element: <AdminSync /> },
  { path: "/admin/users", element: <AdminUsers /> },
  { path: "/admin/security", element: <AdminSecurity /> },
]);

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        <Sonner position="top-right" />
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;
