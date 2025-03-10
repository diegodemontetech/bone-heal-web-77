
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

// Content-related pages
const AdminNews = lazy(() => import("@/pages/admin/News"));
const AdminStudies = lazy(() => import("@/pages/admin/Studies"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const contentRoutes: RouteObject[] = [
  {
    path: "news",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <AdminNews />
      </Suspense>
    )
  },
  {
    path: "studies",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <AdminStudies />
      </Suspense>
    )
  }
];
