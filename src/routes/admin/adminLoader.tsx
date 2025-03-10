
import { ReactNode, Suspense } from "react";

export const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const withSuspense = (Component: ReactNode) => (
  <Suspense fallback={<AdminLoader />}>
    {Component}
  </Suspense>
);
