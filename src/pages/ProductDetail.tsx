
import { lazy, Suspense } from "react";
import ProductDetailSkeleton from "@/components/product/detail/ProductDetailSkeleton";

const ProductDetailPage = lazy(() => import("@/components/product/detail/ProductDetailPage"));

const ProductDetail = () => {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailPage />
    </Suspense>
  );
};

export default ProductDetail;
