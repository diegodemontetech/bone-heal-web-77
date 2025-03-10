
import { RouteObject } from "react-router-dom";
import AdminLayout from "@/components/admin/Layout";
import { adminDashboardRoutes } from "./admin/dashboardRoutes";
import { productRoutes } from "./admin/productRoutes";
import { orderRoutes } from "./admin/orderRoutes";
import { userRoutes } from "./admin/userRoutes";
import { contentRoutes } from "./admin/contentRoutes";
import { configRoutes } from "./admin/configRoutes";
import { crmRoutes } from "./admin/crmRoutes";
import { supportRoutes } from "./admin/supportRoutes";
import { whatsappRoutes } from "./admin/whatsappRoutes";

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    ...adminDashboardRoutes,
    ...productRoutes,
    ...orderRoutes,
    ...userRoutes,
    ...contentRoutes,
    ...configRoutes,
    ...crmRoutes,
    ...supportRoutes,
    ...whatsappRoutes
  ]
};
