
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard } from "lucide-react";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price?: number;
    description?: string;
    image?: string;
  };
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem, cartItems } = useCart();
  const session = useSession();

  const isInCart = cartItems.some(item => item.id === product.id);
  const price = product.price || 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!price) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image || '',
    });
  };

  return (
    <div className="lg:col-span-5 mt-10 lg:mt-0">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {product.name}
      </h1>

      <div className="mt-4">
        <h2 className="sr-only">Product information</h2>
        <p className="text-3xl tracking-tight text-gray-900">
          R$ {price.toFixed(2)}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-base text-gray-900">{product.description}</p>
      </div>

      {session && price > 0 && (
        <div className="mt-10 space-y-4">
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

          {isInCart && (
            <div className="flex gap-4">
              <Link to="/products" className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Continuar Comprando
                </Button>
              </Link>
              <Link to="/checkout" className="flex-1">
                <Button 
                  variant="default"
                  className="w-full"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Ir para Pagamento
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
