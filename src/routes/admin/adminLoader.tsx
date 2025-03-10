
import { ReactNode, Suspense } from "react";

export const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const AdminRoute = ({ children }: { children?: ReactNode }) => {
  console.log("AdminRoute renderizado");
  return (
    <Suspense fallback={<AdminLoader />}>
      {children}
    </Suspense>
  );
};

export const withAdminLoader = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={<AdminLoader />}>
      <Component {...props} />
    </Suspense>
  );
};
