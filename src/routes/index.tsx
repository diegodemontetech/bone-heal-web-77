
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import PageLoader from "@/components/PageLoader";

// Pages with immediate loading
import Home from "@/pages/Home";

// Pages with lazy loading
const Produtos = lazy(() => import("@/pages/Produtos"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const ComoFunciona = lazy(() => import("@/pages/ComoFunciona"));
const CasosClinicos = lazy(() => import("@/pages/CasosClinicos"));
const Sobre = lazy(() => import("@/pages/Sobre"));
const Contato = lazy(() => import("@/pages/Contato"));
const PageNotFound = lazy(() => import("@/pages/PageNotFound"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/produtos",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Produtos />
      </Suspense>
    )
  },
  {
    path: "/produtos/:slug",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProductDetail />
      </Suspense>
    )
  },
  {
    path: "/como-funciona",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ComoFunciona />
      </Suspense>
    )
  },
  {
    path: "/casos-clinicos",
    element: (
      <Suspense fallback={<PageLoader />}>
        <CasosClinicos />
      </Suspense>
    )
  },
  {
    path: "/sobre",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Sobre />
      </Suspense>
    )
  },
  {
    path: "/contato",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Contato />
      </Suspense>
    )
  },
  // Fallback for pages not found
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PageNotFound />
      </Suspense>
    )
  }
];
