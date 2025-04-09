
import { BrowserRouter, Route, Routes as RoutesList } from "react-router-dom";
import Home from "@/pages/Index";
import About from "@/pages/About";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Studies from "@/pages/Studies";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Orders from "@/pages/orders/Orders";
import OrderDetails from "@/pages/orders/OrderDetails";
import { adminRoutes } from "@/routes/adminRoutes";
import Support from "@/pages/support/Tickets";
import TicketDetails from "@/pages/support/TicketDetails"; 
import { AdminRoute } from "@/routes/admin/adminLoader";
import Layout from "@/components/admin/Layout";
import ComoFunciona from "@/pages/ComoFunciona";
import PoliticaTroca from "@/pages/PoliticaTroca";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/checkout/Checkout";
import MercadoPagoRedirect from "@/pages/checkout/MercadoPagoRedirect";
import RouteWithSidebar from "@/components/RouteWithSidebar";

// Importação das páginas de perfil
import ProfilePage from "@/pages/profile/Profile";
import ProfileOrders from "@/pages/profile/Orders";
import ProfileOrderDetails from "@/pages/profile/OrderDetails";
import ProfileTickets from "@/pages/profile/Tickets";
import ProfileTicketDetails from "@/pages/profile/TicketDetails";
import NotificationSettings from "@/pages/profile/NotificationSettings";

export function Routes() {
  return (
    <BrowserRouter>
      <RoutesList>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/studies" element={<Studies />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/politica-troca" element={<PoliticaTroca />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* Rotas de perfil */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/orders" element={<ProfileOrders />} />
        <Route path="/profile/orders/:id" element={<ProfileOrderDetails />} />
        <Route path="/profile/tickets" element={<ProfileTickets />} />
        <Route path="/profile/tickets/:id" element={<ProfileTicketDetails />} />
        <Route path="/profile/notifications" element={<NotificationSettings />} />
        
        {/* Rotas de Admin - usando o componente das rotas administrativas diretamente */}
        <Route path="/admin" element={<AdminRoute>{adminRoutes.element}</AdminRoute>}>
          {adminRoutes.children && adminRoutes.children
            .filter(Boolean)
            .map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
        </Route>
        
        {/* Rotas de Suporte */}
        <Route path="/support/tickets" element={<Support />} />
        <Route path="/support/tickets/:id" element={<TicketDetails />} />
        
        {/* Payment Routes */}
        <Route path="/checkout/mercadopago" element={
          <RouteWithSidebar>
            <MercadoPagoRedirect />
          </RouteWithSidebar>
        } />
      </RoutesList>
    </BrowserRouter>
  );
}

export default Routes;
