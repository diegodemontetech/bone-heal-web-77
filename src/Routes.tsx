
import { createBrowserRouter, Navigate } from "react-router-dom";

import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/checkout/Checkout";
import Success from "@/pages/checkout/Success";
import Failure from "@/pages/checkout/Failure";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import OrderDetails from "@/pages/orders/OrderDetails";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import AdminProducts from "@/pages/admin/Products";
import Security from "@/pages/admin/Security";
import EmailTemplates from "@/pages/admin/EmailTemplates";
import Sync from "@/pages/admin/Sync";
import ShippingRates from "@/pages/admin/ShippingRates";
import Vouchers from "@/pages/admin/Vouchers";
import Users from "@/pages/admin/Users";
import News from "@/pages/admin/News";
import Studies from "@/pages/admin/Studies";
import NewsPage from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import StudiesPage from "@/pages/Studies";
import AdminOrders from "@/pages/admin/Orders";
import AdminLeads from "@/pages/admin/Leads";
import AdminWhatsApp from "@/pages/admin/Whatsapp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/:slug",
    element: <ProductDetail />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/checkout/success",
    element: <Success />,
  },
  {
    path: "/checkout/failure",
    element: <Failure />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/orders/:id",
    element: <OrderDetails />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/products",
    element: <AdminProducts />,
  },
  {
    path: "/admin/orders",
    element: <AdminOrders />,
  },
  {
    path: "/admin/security",
    element: <Security />,
  },
  {
    path: "/admin/email-templates",
    element: <EmailTemplates />,
  },
  {
    path: "/admin/sync",
    element: <Sync />,
  },
  {
    path: "/admin/shipping-rates",
    element: <ShippingRates />,
  },
  {
    path: "/admin/shipping",
    element: <ShippingRates />,
  },
  {
    path: "/admin/vouchers",
    element: <Vouchers />,
  },
  {
    path: "/admin/users",
    element: <Users />,
  },
  {
    path: "/admin/news",
    element: <News />,
  },
  {
    path: "/admin/studies",
    element: <Studies />,
  },
  {
    path: "/admin/leads",
    element: <AdminLeads />,
  },
  {
    path: "/admin/whatsapp",
    element: <AdminWhatsApp />,
  },
  {
    path: "/news",
    element: <NewsPage />,
  },
  {
    path: "/news/:slug",
    element: <NewsDetail />,
  },
  {
    path: "/studies",
    element: <StudiesPage />,
  },
]);

export default router;
