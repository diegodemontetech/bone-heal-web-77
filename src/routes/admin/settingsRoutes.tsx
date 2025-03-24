
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const Settings = lazy(() => import("@/pages/admin/Settings"));
const Shipping = lazy(() => import("@/pages/admin/Shipping"));
const Security = lazy(() => import("@/pages/admin/Security"));
const Sync = lazy(() => import("@/pages/admin/Sync"));
const NotificationSettings = lazy(() => import("@/pages/admin/NotificationSettings"));

const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const settingsRoutes: RouteObject[] = [
  {
    path: "settings",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <Settings />
      </Suspense>
    ),
  },
  {
    path: "settings/general",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <Settings />
      </Suspense>
    ),
  },
  {
    path: "settings/notifications",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <NotificationSettings />
      </Suspense>
    ),
  },
  {
    path: "shipping",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <Shipping />
      </Suspense>
    ),
  },
  {
    path: "security",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <Security />
      </Suspense>
    ),
  },
  {
    path: "sync",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <Sync />
      </Suspense>
    ),
  }
];
