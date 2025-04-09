
import { Product } from "@/types/product";
import ProductHeader from "./ProductHeader";
import ProductActions from "./ProductActions";
import ProductGallery from "./ProductGallery";
import ProductTechDetails from "./ProductTechDetails";
import ProductReviews from "./ProductReviews";
import FloatingActions from "./FloatingActions";
import ProductBulletPoints from "./ProductBulletPoints";
import { ProductPricing } from "../products/ProductPricing";
import ProductQuestions from "./ProductQuestions";
import GoogleReviews from "./GoogleReviews";
import { Separator } from "../ui/separator";

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

      <div className="space-y-12 mb-12">
        {/* Avaliações */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-2xl font-bold">Avaliações do Produto</h2>
            <Separator className="bg-gray-200" />
          </div>
          <GoogleReviews />
          <div className="mt-8">
            <ProductReviews productId={product.id} product={product} />
          </div>
        </div>

        {/* Descrição do produto */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-2xl font-bold">Descrição</h2>
            <Separator className="bg-gray-200" />
          </div>
          <div className="text-gray-600 leading-relaxed">
            {product.full_description || product.description || "Nenhuma descrição disponível."}
          </div>
        </div>
        
        {/* Detalhes técnicos */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-2xl font-bold">Detalhes Técnicos</h2>
            <Separator className="bg-gray-200" />
          </div>
          <ProductTechDetails product={product} />
        </div>
        
        {/* Perguntas e respostas */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-2xl font-bold">Perguntas e Respostas</h2>
            <Separator className="bg-gray-200" />
          </div>
          <ProductQuestions productId={product.id} />
        </div>
      </div>
      
      <FloatingActions product={product} profile={profile} />
    </>
  );
};

export default ProductDetailContent;
