
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CartWidget = () => {
  const { cartItems, total, removeItem, updateQuantity } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const itemCount = cartItems && cartItems.length > 0 
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0) 
    : 0;

  // Animate badge when cart items change
  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  const handleCheckout = () => {
    setIsOpen(false); // Close the drawer before navigation
    if (cartItems && cartItems.length > 0) {
      navigate("/cart");
    } else {
      navigate("/products");
    }
  };

  if (itemCount === 0) {
    return (
      <Button variant="ghost" size="icon" className="relative text-primary" onClick={() => navigate("/products")}>
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-primary">
          <ShoppingCart className="h-5 w-5" />
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Badge 
              className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs bg-primary text-white"
              variant="default"
            >
              {itemCount}
            </Badge>
          </motion.div>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> 
            Meu Carrinho
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Seu carrinho está vazio</h3>
              <p className="text-muted-foreground mb-6">Adicione produtos ao seu carrinho para continuar.</p>
              <Link to="/produtos" onClick={() => setIsOpen(false)}>
                <Button>Explorar Produtos</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-4 pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="relative h-20 w-20 bg-white rounded-md border overflow-hidden">
                      <img
                        src={`/products/${item.image}`}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 px-0 h-6 mt-1"
                        onClick={() => removeItem(item.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
                
              <div className="mt-6 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entrega</span>
                    <span>Calculado no checkout</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </Button>
                  <div className="text-xs text-center text-muted-foreground">
                    Frete e opções de pagamento na finalização da compra
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartWidget;
