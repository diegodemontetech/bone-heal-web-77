import {
  createBrowserRouter,
} from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Contact from "@/pages/Contact";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Users from "@/pages/admin/Users";
import ProductsAdmin from "@/pages/admin/Products";
import OrdersAdmin from "@/pages/admin/Orders";
import NewsAdmin from "@/pages/admin/News";
import StudiesAdmin from "@/pages/admin/Studies";
import ShippingRatesAdmin from "@/pages/admin/ShippingRates";
import WhatsappAdmin from "@/pages/admin/Whatsapp";
import LeadsAdmin from "@/pages/admin/Leads";
import Orders from "@/pages/Orders";
import News from "@/pages/News";
import Studies from "@/pages/Studies";
import Shipping from "@/pages/Shipping";
import Sync from "@/pages/admin/Sync";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/:id",
    element: <ProductDetail />,
  },
  {
    path: "/contact",
    element: <Contact />,
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
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/users",
    element: <Users />,
  },
  {
    path: "/admin/products",
    element: <ProductsAdmin />,
  },
  {
    path: "/admin/orders",
    element: <OrdersAdmin />,
  },
  {
    path: "/admin/news",
    element: <NewsAdmin />,
  },
  {
    path: "/admin/studies",
    element: <StudiesAdmin />,
  },
  {
    path: "/admin/shipping-rates",
    element: <ShippingRatesAdmin />,
  },
  {
    path: "/admin/whatsapp",
    element: <WhatsappAdmin />,
  },
  {
    path: "/admin/leads",
    element: <LeadsAdmin />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/news",
    element: <News />,
  },
  {
    path: "/studies",
    element: <Studies />,
  },
  {
    path: "/shipping",
    element: <Shipping />,
  },
  {
    path: "/admin/sync",
    element: <Sync />,
  },
]);

export default routes;
