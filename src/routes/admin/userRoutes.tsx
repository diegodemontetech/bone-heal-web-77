
import { RouteObject } from "react-router-dom";
import Users from "@/pages/admin/Users";
import Customers from "@/pages/admin/Customers";
import WhatsAppSettings from "@/pages/admin/WhatsAppSettings";
import ApiEvolution from "@/pages/admin/ApiEvolution";

export const userRoutes: RouteObject[] = [
  {
    path: "users",
    element: <Users />,
  },
  {
    path: "customers",
    element: <Customers />,
  },
  {
    path: "whatsapp/settings",
    element: <WhatsAppSettings />,
  },
  {
    path: "api-evolution",
    element: <ApiEvolution />,
  },
];
