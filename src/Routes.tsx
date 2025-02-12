
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Studies from "./pages/Studies";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/admin/Products";
import AdminStudies from "./pages/admin/Studies";
import AdminNews from "./pages/admin/News";
import AdminUsers from "./pages/admin/Users";
import AdminShippingRates from "./pages/admin/ShippingRates";
import AdminLeads from "./pages/admin/Leads";
import AdminWhatsAppMessages from "./pages/admin/WhatsAppMessages";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "./integrations/supabase/client";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      console.log("Checking admin status for user:", session.user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      console.log("Admin check profile:", data);
      return data;
    },
    enabled: !!session?.user?.id,
    retry: 1,
  });

  if (!session || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile?.is_admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:slug" element={<NewsDetail />} />
      <Route path="/studies" element={<Studies />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/studies"
        element={
          <AdminRoute>
            <AdminStudies />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/news"
        element={
          <AdminRoute>
            <AdminNews />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/shipping-rates"
        element={
          <AdminRoute>
            <AdminShippingRates />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/leads"
        element={
          <AdminRoute>
            <AdminLeads />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/whatsapp-messages"
        element={
          <AdminRoute>
            <AdminWhatsAppMessages />
          </AdminRoute>
        }
      />
    </RouterRoutes>
  );
};

export default Routes;
