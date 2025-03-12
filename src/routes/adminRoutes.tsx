
import { RouteObject } from "react-router-dom";
import AdminLayout from "@/components/admin/Layout";
import { dashboardRoutes } from "./admin/dashboardRoutes";
import { productRoutes } from "./admin/productRoutes";
import { salesRoutes } from "./admin/orderRoutes";
import { userRoutes } from "./admin/userRoutes";
import { contentRoutes } from "./admin/contentRoutes";
import { configRoutes } from "./admin/configRoutes";
import { crmRoutes } from "./admin/crmRoutes";
import { supportRoutes } from "./admin/supportRoutes";
import { whatsappRoutes } from "./admin/whatsappRoutes";

// Garantir que todas as rotas tenham um array válido para evitar o erro de map em undefined
const allRoutes = [
  ...dashboardRoutes,
  ...productRoutes,
  ...salesRoutes,
  ...userRoutes,
  ...contentRoutes,
  ...configRoutes,
  ...crmRoutes,
  ...supportRoutes,
  ...whatsappRoutes
].filter(Boolean); // Filtrar qualquer valor undefined ou null

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: allRoutes
};
