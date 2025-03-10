
import { BrowserRouter, Route, Routes as RoutesList, createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Index";
import About from "@/pages/About";
import Products from "@/pages/Products";
import Studies from "@/pages/Studies";
import News from "@/pages/News";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Orders from "@/pages/orders/Orders";
import OrderDetails from "@/pages/orders/OrderDetails";
import { adminRoutes } from "@/routes/adminRoutes";
import Support from "@/pages/support/Tickets";
import TicketDetails from "@/pages/support/TicketDetails"; 
import AdminRoute from "@/routes/admin/adminLoader"; 

export function Routes() {
  return (
    <BrowserRouter>
      <RoutesList>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/studies" element={<Studies />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Rotas de Pedidos */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />

        {/* Rotas de Admin */}
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="/admin/*" element={adminRoutes} />
        
        {/* Rotas de Suporte */}
        <Route path="/support/tickets" element={<Support />} />
        <Route path="/support/tickets/:id" element={<TicketDetails />} />
        
      </RoutesList>
    </BrowserRouter>
  );
}

// Criar um router para uso com RouterProvider
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/studies",
    element: <Studies />,
  },
  {
    path: "/news",
    element: <News />,
  },
  {
    path: "/contact",
    element: <Contact />,
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
    path: "/support/tickets",
    element: <Support />,
  },
  {
    path: "/support/tickets/:id",
    element: <TicketDetails />,
  },
]);
