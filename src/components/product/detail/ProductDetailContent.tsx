
import { Product } from "@/types/product";
import { Separator } from "@/components/ui/separator";
import ProductImageSection from "./ProductImageSection";
import { ProductPricing } from "@/components/products/ProductPricing";
import { ProductActions } from "@/components/products/ProductActions";
import { parseJsonObject } from "@/utils/supabaseJsonUtils";

interface ProductDetailContentProps {
  product: Product;
}

const ProductDetailContent = ({ product }: ProductDetailContentProps) => {
  // Parse technical details to ensure they're in the right format
  const technicalDetails = parseJsonObject(product.technical_details, {});

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ProductImageSection 
          mainImage={product.main_image}
          defaultImageUrl={product.default_image_url}
          productName={product.name}
        />

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600">{product.short_description}</p>
          </div>
          
          {/* Adiciona o preço do produto */}
          {product.price && (
            <div className="mt-2">
              <ProductPricing price={product.price} />
            </div>
          )}
          
          {/* Bullets points e características */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Características:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {technicalDetails && typeof technicalDetails === 'object' && 'caracteristicas' in technicalDetails ? (
                <li>{String(technicalDetails.caracteristicas)}</li>
              ) : (
                <li>Produto de alta qualidade para procedimentos odontológicos</li>
              )}
              {technicalDetails && typeof technicalDetails === 'object' && 'dimensoes' in technicalDetails && (
                <li>Dimensões: {String(technicalDetails.dimensoes)}</li>
              )}
              {technicalDetails && typeof technicalDetails === 'object' && 'composicao' in technicalDetails && (
                <li>Composição: {String(technicalDetails.composicao)}</li>
              )}
            </ul>
          </div>
          
          <div id="product-actions">
            <ProductActions product={product} />
          </div>
        </div>
      </div>

      <div className="space-y-12 mb-12">
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
          <div className="text-gray-600">
            {technicalDetails && Object.keys(technicalDetails).length > 0 ? (
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(technicalDetails).map(([key, value]) => {
                  if (typeof value === 'string' || typeof value === 'number') {
                    return (
                      <div key={key} className="mb-3">
                        <dt className="font-medium text-gray-700 capitalize mb-1">{key.replace(/_/g, ' ')}</dt>
                        <dd>{String(value)}</dd>
                      </div>
                    );
                  }
                  return null;
                })}
              </dl>
            ) : (
              <p>Nenhum detalhe técnico disponível.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailContent;
