
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Componentes com carregamento tardio
const Profile = lazy(() => import("@/pages/profile/Profile"));
const ProfileOrders = lazy(() => import("@/pages/profile/Orders"));
const ProfileOrderDetails = lazy(() => import("@/pages/profile/OrderDetails"));
const ProfileTickets = lazy(() => import("@/pages/profile/Tickets"));
const ProfileTicketDetails = lazy(() => import("@/pages/profile/TicketDetails"));
const NotificationSettings = lazy(() => import("@/pages/profile/NotificationSettings"));

// Loader para componentes com lazy loading
const ProfileLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const profileRoutes: RouteObject[] = [
  {
    path: "profile",
    element: (
      <Suspense fallback={<ProfileLoader />}>
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "profile/orders",
    element: (
      <Suspense fallback={<ProfileLoader />}>
        <ProtectedRoute>
          <ProfileOrders />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "profile/orders/:id",
    element: (
      <Suspense fallback={<ProfileLoader />}>
        <ProtectedRoute>
          <ProfileOrderDetails />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "profile/tickets",
    element: (
      <Suspense fallback={<ProfileLoader />}>
        <ProtectedRoute>
          <ProfileTickets />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "profile/tickets/:id",
    element: (
      <Suspense fallback={<ProfileLoader />}>
        <ProtectedRoute>
          <ProfileTicketDetails />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "profile/notifications",
    element: (
      <Suspense fallback={<ProfileLoader />}>
        <ProtectedRoute>
          <NotificationSettings />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
