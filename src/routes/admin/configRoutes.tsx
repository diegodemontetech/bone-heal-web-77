
import { RouteObject } from "react-router-dom";
import AdminSettings from "@/pages/admin/Settings";
import AdminMetatags from "@/pages/admin/Metatags";
import AdminShipping from "@/pages/admin/Shipping";

export const configRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <AdminSettings />,
  },
  {
    path: "metatags",
    element: <AdminMetatags />,
  },
  {
    path: "shipping",
    element: <AdminShipping />,
  }
];
