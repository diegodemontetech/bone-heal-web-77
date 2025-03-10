
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { adminRoutes } from "./routes/adminRoutes";

// Criando o roteador
export const router = createBrowserRouter([
  ...publicRoutes,
  adminRoutes
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
