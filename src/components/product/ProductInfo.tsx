
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const session = useSession();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.main_image || "",
    });

    toast.success("Produto adicionado ao carrinho", {
      description: `${quantity}x ${product.name}`,
    });
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  if (!product) return null;

  return (
    <div className="lg:col-span-5 mt-10 lg:mt-0">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {product.name}
      </h1>

      {session && product.price && (
        <div className="mt-4">
          <p className="text-3xl tracking-tight text-gray-900">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
      )}

      {product.description && (
        <div className="mt-6">
          <h3 className="sr-only">Descrição</h3>
          <div className="space-y-6 text-base text-gray-700">
            {product.description}
          </div>
        </div>
      )}

      {session && (
        <div className="mt-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button 
              onClick={handleAddToCart} 
              className="flex-1 font-bold text-white hover:bg-primary-dark"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
