
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const LeadsKanban = lazy(() => import("@/pages/admin/LeadsKanban"));
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const kanbanRoutes: RouteObject[] = [
  {
    path: "kanban",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <LeadsKanban />
      </Suspense>
    ),
  }
];
