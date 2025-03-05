
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShoppingCart, Heart, Minus, Plus, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
    <div className="space-y-8">
      {!isMobile && (
        <div>
          <Badge className="mb-4 bg-violet-100 text-violet-900 hover:bg-violet-200">
            Mais Vendido
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-baseline gap-4 mb-6">
            <p className="text-3xl font-semibold tracking-tight text-gray-900">
              {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            {price > 100 && (
              <p className="text-sm text-gray-500">
                ou em até 12x sem juros
              </p>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {price > 0 && (
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="inline-flex items-center rounded-lg border border-gray-200">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-12 w-12 rounded-none border-r"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                className="h-12 w-12 rounded-none border-l"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1 h-12 bg-violet-600 hover:bg-violet-700 text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Adicionar ao Carrinho
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {isInCart && (
            <div className="flex gap-4">
              <Link to="/products" className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                >
                  Continuar Comprando
                </Button>
              </Link>
              <Link to="/checkout" className="flex-1">
                <Button 
                  className="w-full h-12 bg-green-600 hover:bg-green-700"
                >
                  Finalizar Compra
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-8 border-t">
        <div className="flex items-center justify-center gap-2 text-center">
          <ShieldCheck className="w-5 h-5 text-violet-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Aprovado Anvisa</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-center border-l">
          <Award className="w-5 h-5 text-violet-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Produto Patenteado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
