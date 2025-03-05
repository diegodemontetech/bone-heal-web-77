
import { Product } from "@/types/product";
import ProductHeader from "./ProductHeader";
import ProductActions from "./ProductActions";
import ProductGallery from "./ProductGallery";
import ProductTabs from "./ProductTabs";
import ProductReviews from "./ProductReviews";

interface ProductDetailContentProps {
  product: Product;
  profile: any | null;
}

const ProductDetailContent = ({ product, profile }: ProductDetailContentProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ProductGallery
          mainImage={product.main_image || "/placeholder.svg"}
          gallery={product.gallery || []}
        />

        <div className="space-y-6">
          <ProductHeader product={product} />
          <ProductActions product={product} profile={profile} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <ProductTabs product={product} />
        </div>
        <div>
          <ProductReviews product={product} />
        </div>
      </div>
    </>
  );
};

export default ProductDetailContent;
