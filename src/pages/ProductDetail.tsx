
import { lazy } from "react";
const ProductDetailPage = lazy(() => import("@/components/product/detail/ProductDetailPage"));

const ProductDetail = () => {
  return <ProductDetailPage />;
};

export default ProductDetail;
