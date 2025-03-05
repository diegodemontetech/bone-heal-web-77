
import { createBrowserRouter } from "react-router-dom";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import AdminProducts from "./pages/admin/Products";
import Tickets from "./pages/support/Tickets";
import TicketDetails from "./pages/support/TicketDetails";
import AdminTickets from "./pages/admin/Tickets";

// Importações substituídas ou que estão faltando
import Index from "./pages/Index";
import { default as Checkout } from "./pages/checkout/Checkout";
import AdminDashboard from "./pages/admin/Dashboard";

export const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/product/:slug",
    element: <ProductDetail />,
  },
  {
    path: "/profile",
    element: <Profile />,
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
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/admin/products",
    element: <AdminProducts />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/support/tickets",
    element: <Tickets />,
  },
  {
    path: "/support/tickets/:id",
    element: <TicketDetails />,
  },
  {
    path: "/admin/tickets",
    element: <AdminTickets />,
  },
];

export const router = createBrowserRouter(routes);
