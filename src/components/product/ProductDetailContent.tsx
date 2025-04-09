
import { Product } from "@/types/product";
import ProductHeader from "./ProductHeader";
import ProductActions from "./ProductActions";
import ProductGallery from "./ProductGallery";
import ProductTechDetails from "./ProductTechDetails";
import GoogleReviews from "./GoogleReviews";
import ProductReviews from "./ProductReviews";
import FloatingActions from "./FloatingActions";
import ProductBulletPoints from "./ProductBulletPoints";
import ProductTabs from "./ProductTabs";
import { ProductPricing } from "../products/ProductPricing";

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
          
          {/* Adiciona o preço do produto */}
          {product.price && (
            <div className="mt-2">
              <ProductPricing price={product.price} />
            </div>
          )}
          
          {/* Adição dos bullet points do produto */}
          <ProductBulletPoints product={product} />
          
          <div id="product-actions">
            <ProductActions product={product} profile={profile} />
          </div>
        </div>
      </div>

      <div className="mb-12">
        {/* Usar ProductTabs para evitar duplicação e melhorar a organização */}
        <ProductTabs product={product} />
        
        <div className="mt-12 pt-6 border-t">
          <h2 className="text-2xl font-bold mb-6">Avaliações do Produto</h2>
          <GoogleReviews />
          
          <div className="mt-8">
            <ProductReviews product={product} />
          </div>
        </div>
      </div>
      
      <FloatingActions product={product} profile={profile} />
    </>
  );
};

export default ProductDetailContent;
