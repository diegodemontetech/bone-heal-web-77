
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";

// Lazy imports
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const OrderDetails = lazy(() => import("./pages/orders/OrderDetails"));

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
    path: "/products/:id",
    element: <Products />, // Usando Products temporariamente
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <Cart />,
  },
  {
    path: "/checkout/success",
    element: <Cart />, // Usando Cart provisoriamente
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
