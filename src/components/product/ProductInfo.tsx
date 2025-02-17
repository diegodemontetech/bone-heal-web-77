
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, CreditCard } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { Link, useNavigate } from "react-router-dom";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem, cartItems } = useCart();
  const session = useSession();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.main_image || "",
    });

    toast.success("Produto adicionado ao carrinho", {
      description: `${quantity}x ${product.name}`,
      action: {
        label: "Ver carrinho",
        onClick: () => navigate("/cart")
      }
    });
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const isInCart = cartItems.some(item => item.id === product.id);

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
              <Link to="/cart" className="flex-1">
                <Button 
                  variant="secondary" 
                  className="w-full"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ver Carrinho
                </Button>
              </Link>
              <Link to="/checkout" className="flex-1">
                <Button 
                  variant="default"
                  className="w-full"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Finalizar Compra
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
