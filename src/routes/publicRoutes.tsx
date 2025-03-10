
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

// Importando páginas públicas
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Products from "@/pages/Products";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import ProductDetail from "@/pages/ProductDetail";
import AdminLogin from "@/pages/AdminLogin";

// Lazy imports
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Orders = lazy(() => import("@/pages/orders/Orders"));
const OrderDetails = lazy(() => import("@/pages/orders/OrderDetails"));
const Checkout = lazy(() => import("@/pages/checkout/Checkout"));
const CheckoutSuccess = lazy(() => import("@/pages/checkout/Success"));
const Studies = lazy(() => import("@/pages/Studies"));

// Loader component para páginas lazy
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const publicRoutes: RouteObject[] = [
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
    element: <ProductDetail />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Checkout />
      </Suspense>
    ),
  },
  {
    path: "/checkout/success",
    element: (
      <Suspense fallback={<PageLoader />}>
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
    element: <Profile />,
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<PageLoader />}>
        <About />
      </Suspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Contact />
      </Suspense>
    ),
  },
  {
    path: "/studies",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Studies />
      </Suspense>
    ),
  },
  {
    path: "/orders",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Orders />
      </Suspense>
    ),
  },
  {
    path: "/orders/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <OrderDetails />
      </Suspense>
    ),
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  }
];
