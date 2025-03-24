
import { RouteObject } from "react-router-dom";
import AdminSettings from "@/pages/admin/Settings";
import AdminShipping from "@/pages/admin/Shipping";

export const configRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <AdminSettings />,
  },
  {
    path: "shipping",
    element: <AdminShipping />,
  }
];
