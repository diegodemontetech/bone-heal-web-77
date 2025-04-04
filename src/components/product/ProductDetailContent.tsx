
import { Product } from "@/types/product";
import ProductHeader from "./ProductHeader";
import ProductActions from "./ProductActions";
import ProductGallery from "./ProductGallery";
import ProductTechDetails from "./ProductTechDetails";
import GoogleReviews from "./GoogleReviews";
import ProductReviews from "./ProductReviews";
import FloatingActions from "./FloatingActions";

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
          <div id="product-actions">
            <ProductActions product={product} profile={profile} />
          </div>
          <GoogleReviews />
        </div>
      </div>

      <div className="mb-12">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Descrição do Produto</h2>
          <div className="prose max-w-none">
            {product.full_description || product.description || "Nenhuma descrição disponível."}
          </div>
        </div>
        
        <ProductTechDetails product={product} />
        
        <div className="mt-8">
          <ProductReviews product={product} />
        </div>
      </div>
      
      <FloatingActions product={product} profile={profile} />
    </>
  );
};

export default ProductDetailContent;
