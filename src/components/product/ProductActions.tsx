
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShoppingCart, Award, FileCheck, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Product } from "@/types/product";

interface ProductActionsProps {
  product: Product;
  profile: any | null;
}

const ProductActions = ({ product, profile }: ProductActionsProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (added) {
      const timer = setTimeout(() => {
        setAdded(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [added]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.main_image || "/placeholder.svg",
      quantity: 1
    });

    setAdded(true);
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {profile ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Preço</span>
            <span className="text-3xl font-bold text-black">
              {formatCurrency(product.price || 0)}
            </span>
          </div>
          
          <div className="space-y-4">
            <Button
              className="w-full py-6 text-base bg-green-600 hover:bg-green-700 text-white font-bold"
              size="lg"
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 mr-2" /> Adicionado ao carrinho
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" /> Adicionar ao carrinho
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="py-6 text-base border-black text-black hover:bg-black/5"
                onClick={() => navigate("/products")}
              >
                Continuar Comprando
              </Button>
              <Button
                className="py-6 text-base bg-black hover:bg-black/90 text-white font-bold"
                size="lg"
                onClick={() => navigate("/cart")}
              >
                Finalizar Pedido
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
              <div className="flex flex-col items-center text-center">
                <Award className="h-5 w-5 text-gray-500 mb-1" />
                <span className="text-xs text-gray-600">Produto Patenteado</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <FileCheck className="h-5 w-5 text-gray-500 mb-1" />
                <span className="text-xs text-gray-600">Produto Anvisa</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Factory className="h-5 w-5 text-gray-500 mb-1" />
                <span className="text-xs text-gray-600">Direto da Indústria</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-primary/5 p-4 rounded-md border border-primary/10 mb-4">
            <p className="text-sm text-center text-gray-700">
              Faça login como dentista para ver os preços e realizar compras
            </p>
          </div>
          
          <Button
            className="w-full py-6 text-base bg-primary hover:bg-primary/90"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Fazer Login para Comprar
          </Button>
          
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
            <div className="flex flex-col items-center text-center">
              <Award className="h-5 w-5 text-gray-500 mb-1" />
              <span className="text-xs text-gray-600">Produto Patenteado</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <FileCheck className="h-5 w-5 text-gray-500 mb-1" />
              <span className="text-xs text-gray-600">Produto Anvisa</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Factory className="h-5 w-5 text-gray-500 mb-1" />
              <span className="text-xs text-gray-600">Direto da Indústria</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductActions;
