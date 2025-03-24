
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

// Lazy-loaded components for better performance
const Tickets = lazy(() => import("@/pages/admin/Tickets"));
const TicketDetails = lazy(() => import("@/pages/admin/TicketDetails"));
const Contacts = lazy(() => import("@/pages/admin/Contacts"));
const ContactDetails = lazy(() => import("@/pages/admin/ContactDetails"));

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
        <Tickets />
      </Suspense>
    ),
  },
  {
    path: "tickets/:id",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <TicketDetails />
      </Suspense>
    ),
  },
  {
    path: "contacts",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <Contacts />
      </Suspense>
    ),
  },
  {
    path: "contacts/:id",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ContactDetails />
      </Suspense>
    ),
  },
];
