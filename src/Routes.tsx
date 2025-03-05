
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
import Index from "./pages/Index";
import { default as Checkout } from "./pages/checkout/Checkout";
import ContactPage from "./pages/Contact";
import AboutPage from "./pages/About";
import NewsPage from "./pages/News";
import StudiesPage from "./pages/Studies";

// Criamos um componente placeholder para o AdminDashboard
import React from "react";
const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
      <p>Conteúdo do dashboard em desenvolvimento.</p>
    </div>
  );
};

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
    path: "/products/:slug",
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
    path: "/admin",
    element: <AdminDashboard />,
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
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/news",
    element: <NewsPage />,
  },
  {
    path: "/studies",
    element: <StudiesPage />,
  },
];

export const router = createBrowserRouter(routes);
