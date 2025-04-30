
import { Product } from "@/types/product";
import ProductBulletPoints from "@/components/product/ProductBulletPoints";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";

interface ProductInfoSectionProps {
  product: Product;
  formattedName: string;
}

const ProductInfoSection = ({ product, formattedName }: ProductInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{formattedName}</h1>
      
      <p className="text-lg text-gray-700">
        {product.short_description || product.description || "Membrana para regeneração óssea guiada."}
      </p>
      
      {product.price ? (
        <div className="mt-4">
          <p className="text-3xl font-bold text-primary">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-sm text-gray-500">
            ou em até 6x de R$ {(product.price / 6).toFixed(2).replace('.', ',')} sem juros
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-700">
            Consulte preço com nossos vendedores
          </p>
        </div>
      )}

      <ProductBulletPoints product={product} className="mt-6" />

      <div className="pt-6">
        <Button className="w-full py-6 text-lg" size="lg">
          Solicitar Orçamento
        </Button>
        
        <div className="flex items-center justify-center mt-4">
          <WhatsAppButton className="w-full" text="Falar com Consultor" />
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSection;
