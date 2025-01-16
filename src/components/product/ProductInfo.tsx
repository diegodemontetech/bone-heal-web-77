import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCart, CartItem } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { cartItems, setCartItems } = useCart();
  const session = useSession();

  const handleAddToCart = () => {
    if (!product.stock || product.stock <= 0) {
      toast.error("Produto fora de estoque");
      return;
    }

    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      quantity,
      price: product.price || 0,
      image: product.main_image || "",
    };

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, newItem];
    });

    toast.success("Produto adicionado ao carrinho", {
      description: `${quantity}x ${product.name}`,
    });
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && (!product.stock || value <= product.stock)) {
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
                disabled={product.stock !== undefined && quantity >= product.stock}
              >
                +
              </Button>
            </div>
            <Button 
              onClick={handleAddToCart} 
              className="flex-1 font-bold text-white hover:bg-primary-dark"
              disabled={!product.stock || product.stock <= 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock && product.stock > 0 
                ? "Adicionar ao Carrinho"
                : "Fora de Estoque"}
            </Button>
          </div>
          {product.stock !== undefined && product.stock > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {product.stock} unidades em estoque
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;