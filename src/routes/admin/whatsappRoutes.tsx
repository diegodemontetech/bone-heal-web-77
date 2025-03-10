
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// WhatsApp-related pages
const WhatsAppMessages = lazy(() => import("@/pages/admin/WhatsAppMessages"));
const WhatsAppSettings = lazy(() => import("@/pages/admin/WhatsAppSettings"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const whatsappRoutes: RouteObject[] = [
  {
    path: "whatsapp/messages",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SUPPORT}>
          <WhatsAppMessages />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "whatsapp/settings",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_INTEGRATIONS}>
          <WhatsAppSettings />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
