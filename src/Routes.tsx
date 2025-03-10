import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import CheckoutSuccess from "./pages/CheckoutSuccess";

// Importações preguiçosas (lazy) para melhorar performance
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

// Página de pedidos
const Orders = lazy(() => import("./pages/orders/Orders"));
const OrderDetails = lazy(() => import("./pages/orders/OrderDetails"));

const Routes = () => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <Home />,
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
          element: <ProductDetails />,
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
          element: <CheckoutSuccess />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/profile/edit",
          element: <EditProfile />,
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
      ])}
    />
  );
};

export default Routes;
