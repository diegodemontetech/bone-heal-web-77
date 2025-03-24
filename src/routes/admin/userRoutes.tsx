
import { RouteObject } from "react-router-dom";
import Users from "@/pages/admin/Users";
import Customers from "@/pages/admin/Customers";

export const userRoutes: RouteObject[] = [
  {
    path: "users",
    element: <Users />,
  },
  {
    path: "customers",
    element: <Customers />,
  },
];
