
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Badge variant="medical" className="mb-2">Produto Médico</Badge>
      
      <h1 className="text-2xl font-heading font-bold mb-2">{product.name}</h1>
      
      <p className="text-gray-600 mb-4">
        {product.short_description}
      </p>
      
      <div className="flex items-center space-x-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="#FFBA00" 
            className="w-5 h-5"
          >
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        ))}
        <span className="text-sm font-medium text-gray-600">5.0 (10 avaliações)</span>
      </div>
    </div>
  );
};

export default ProductHeader;
