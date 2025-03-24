
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const News = lazy(() => import("@/pages/admin/News"));
const Studies = lazy(() => import("@/pages/admin/Studies"));
const Vouchers = lazy(() => import("@/pages/admin/Vouchers"));
const CommercialConditions = lazy(() => import("@/pages/admin/CommercialConditions"));

const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const marketingRoutes: RouteObject[] = [
  {
    path: "news",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <News />
      </Suspense>
    ),
  },
  {
    path: "studies",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <Studies />
      </Suspense>
    ),
  },
  {
    path: "vouchers",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <Vouchers />
      </Suspense>
    ),
  },
  {
    path: "commercial-conditions",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <CommercialConditions />
      </Suspense>
    ),
  }
];
