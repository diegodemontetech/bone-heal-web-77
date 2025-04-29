
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

// Componente de carregamento
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Páginas com carregamento imediato
import Home from "@/pages/Home";
import ComoFunciona from "@/pages/ComoFunciona";

// Páginas com carregamento preguiçoso
const Produtos = lazy(() => import("@/pages/Produtos"));
const CasosClinicos = lazy(() => import("@/pages/CasosClinicos"));
const Sobre = lazy(() => import("@/pages/Sobre"));
const Contato = lazy(() => import("@/pages/Contato"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/como-funciona",
    element: <ComoFunciona />
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
  // Rota de fallback para páginas não encontradas
  {
    path: "*",
    element: <div className="min-h-screen flex items-center justify-center">Página não encontrada</div>
  }
];
