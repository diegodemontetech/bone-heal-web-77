
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const Orders = lazy(() => import("@/pages/admin/Orders"));
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const orderRoutes: RouteObject[] = [
  {
    path: "orders",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <Orders />
      </Suspense>
    ),
  }
];
