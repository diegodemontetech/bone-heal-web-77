
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import AdminLogin from "./pages/AdminLogin"; // Importando o AdminLogin

// Lazy imports
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const OrderDetails = lazy(() => import("./pages/orders/OrderDetails"));
const Checkout = lazy(() => import("./pages/checkout/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/checkout/Success"));
const Studies = lazy(() => import("./pages/Studies"));

// Layout do Admin
const AdminLayout = lazy(() => import("./components/admin/Layout"));

// Admin Pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminVouchers = lazy(() => import("./pages/admin/Vouchers"));
const AdminNews = lazy(() => import("./pages/admin/News"));
const AdminStudies = lazy(() => import("./pages/admin/Studies"));
const AdminLeads = lazy(() => import("./pages/admin/Leads"));
const AdminWhatsapp = lazy(() => import("./pages/admin/Whatsapp"));
const AdminEmailTemplates = lazy(() => import("./pages/admin/EmailTemplates"));
const AdminShippingRates = lazy(() => import("./pages/admin/ShippingRates"));
const AdminSync = lazy(() => import("./pages/admin/Sync"));
const AdminSecurity = lazy(() => import("./pages/admin/Security"));
const AdminTickets = lazy(() => import("./pages/admin/Tickets"));

// Criando o roteador
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Products />, // Usando Products como Home provisoriamente
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
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/:slug",
    element: <ProductDetail />, // Agora usando o componente ProductDetail
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>}>
        <Checkout />
      </Suspense>
    ),
  },
  {
    path: "/checkout/success",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>}>
        <CheckoutSuccess />
      </Suspense>
    ),
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/edit",
    element: <Profile />, // Usando Profile temporariamente
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<>Loading...</>}>
        <About />
      </Suspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Contact />
      </Suspense>
    ),
  },
  // Adicionar a rota para Studies
  {
    path: "/studies",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>}>
        <Studies />
      </Suspense>
    ),
  },
  // Rota para a página de pedidos
  {
    path: "/orders",
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Orders />
      </Suspense>
    ),
  },
  {
    path: "/orders/:id",
    element: (
      <Suspense fallback={<>Loading...</>}>
        <OrderDetails />
      </Suspense>
    ),
  },
  // Adicionando a rota para a área administrativa de login
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  // Adicionando as rotas admin com o layout apropriado
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "users",
        element: <AdminUsers />
      },
      {
        path: "products",
        element: <AdminProducts />
      },
      {
        path: "orders",
        element: <AdminOrders />
      },
      {
        path: "vouchers",
        element: <AdminVouchers />
      },
      {
        path: "news",
        element: <AdminNews />
      },
      {
        path: "studies",
        element: <AdminStudies />
      },
      {
        path: "leads",
        element: <AdminLeads />
      },
      {
        path: "whatsapp",
        element: <AdminWhatsapp />
      },
      {
        path: "email-templates",
        element: <AdminEmailTemplates />
      },
      {
        path: "shipping-rates",
        element: <AdminShippingRates />
      },
      {
        path: "sync",
        element: <AdminSync />
      },
      {
        path: "security",
        element: <AdminSecurity />
      },
      {
        path: "tickets",
        element: <AdminTickets />
      }
    ]
  }
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
