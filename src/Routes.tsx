
import { Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Admin from "@/pages/Admin";
import AdminProducts from "@/pages/admin/Products";
import AdminShippingRates from "@/pages/admin/ShippingRates";
import AdminNews from "@/pages/admin/News";
import AdminWhatsApp from "@/pages/admin/Whatsapp";
import AdminWhatsAppMessages from "@/pages/admin/WhatsAppMessages";
import AdminLogin from "@/pages/AdminLogin";
import AdminStudies from "@/pages/admin/Studies";
import Studies from "@/pages/Studies";
import Checkout from "@/pages/checkout/Checkout";
import Success from "@/pages/checkout/Success";
import Failure from "@/pages/checkout/Failure";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import AdminOrders from "@/pages/admin/Orders";
import AdminEmailTemplates from "@/pages/admin/EmailTemplates";
import AdminLeads from "@/pages/admin/Leads";
import AdminSync from "@/pages/admin/Sync";
import AdminUsers from "@/pages/admin/Users";
import AdminSecurity from "@/pages/admin/Security";

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:slug" element={<NewsDetail />} />
      <Route path="/studies" element={<Studies />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success" element={<Success />} />
      <Route path="/checkout/failure" element={<Failure />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/shipping-rates" element={<AdminShippingRates />} />
      <Route path="/admin/news" element={<AdminNews />} />
      <Route path="/admin/studies" element={<AdminStudies />} />
      <Route path="/admin/whatsapp" element={<AdminWhatsApp />} />
      <Route path="/admin/whatsapp-messages" element={<AdminWhatsAppMessages />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/email-templates" element={<AdminEmailTemplates />} />
      <Route path="/admin/leads" element={<AdminLeads />} />
      <Route path="/admin/sync" element={<AdminSync />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/security" element={<AdminSecurity />} />
    </RouterRoutes>
  );
};

export default Routes;
