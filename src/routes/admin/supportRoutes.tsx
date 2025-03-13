
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// Support-related pages
const AdminTickets = lazy(() => import("@/pages/admin/Tickets"));
const AdminTicketDetails = lazy(() => import("@/pages/admin/TicketDetails"));
const NotificationSettings = lazy(() => import("@/pages/admin/NotificationSettings"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const supportRoutes: RouteObject[] = [
  {
    path: "tickets",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SUPPORT}>
          <AdminTickets />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "tickets/:id",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SUPPORT}>
          <AdminTicketDetails />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "settings/notifications",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SUPPORT}>
          <NotificationSettings />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
