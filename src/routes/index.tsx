
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

// Admin routes
import { adminRoutes } from "./admin/adminRoutes";

// Lazy load page components
const Home = lazy(() => import("@/pages/HomePage"));
const Products = lazy(() => import("@/pages/ProductsPage"));
const ProductDetails = lazy(() => import("@/pages/ProductPage"));
const About = lazy(() => import("@/pages/AboutPage"));
const HowItWorks = lazy(() => import("@/pages/HowItWorksPage"));
const Studies = lazy(() => import("@/pages/StudiesPage"));
const Contact = lazy(() => import("@/pages/ContactPage"));
const PageNotFound = lazy(() => import("@/pages/PageNotFound"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/produtos",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Products />
      </Suspense>
    ),
  },
  {
    path: "/produtos/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProductDetails />
      </Suspense>
    ),
  },
  {
    path: "/sobre",
    element: (
      <Suspense fallback={<PageLoader />}>
        <About />
      </Suspense>
    ),
  },
  {
    path: "/como-funciona",
    element: (
      <Suspense fallback={<PageLoader />}>
        <HowItWorks />
      </Suspense>
    ),
  },
  {
    path: "/estudos",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Studies />
      </Suspense>
    ),
  },
  {
    path: "/contato",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Contact />
      </Suspense>
    ),
  },
  {
    path: "/admin/*",
    children: adminRoutes,
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PageNotFound />
      </Suspense>
    ),
  },
];
