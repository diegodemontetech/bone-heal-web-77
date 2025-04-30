
import { Product } from "@/types/product";
import { formatProductName } from "@/utils/product-formatters";
import ProductBulletPoints from "@/components/product/ProductBulletPoints";
import ProductTechDetails from "@/components/product/ProductTechDetails";
import ProductImageSection from "./ProductImageSection";
import ProductInfoSection from "./ProductInfoSection";

interface ProductDetailContentProps {
  product: Product;
}

const ProductDetailContent = ({ product }: ProductDetailContentProps) => {
  // Format product name to show brand first with proper registration mark
  const formattedName = formatProductName(product.name);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        {/* Image Section */}
        <ProductImageSection 
          mainImage={product.main_image} 
          defaultImageUrl={product.default_image_url}
          productName={formattedName}
        />

        {/* Product Info */}
        <ProductInfoSection 
          product={product} 
          formattedName={formattedName} 
        />
      </div>

      {/* Additional Sections */}
      <div className="space-y-12 mb-12">
        {/* Description */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Descrição</h2>
          <div className="prose max-w-none">
            <p>{product.full_description || product.description || "Sem descrição detalhada disponível."}</p>
          </div>
        </section>

        {/* Technical Details */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Especificações Técnicas</h2>
          <ProductTechDetails product={product} />
        </section>
      </div>
    </>
  );
};

export default ProductDetailContent;
