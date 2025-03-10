
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";

// Lazy imports
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const OrderDetails = lazy(() => import("./pages/orders/OrderDetails"));
const Checkout = lazy(() => import("./pages/checkout/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/checkout/Success"));
const Studies = lazy(() => import("./pages/Studies"));

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
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
