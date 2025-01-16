import { useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import CartWidget from "@/components/cart/CartWidget";

const Navbar = () => {
  const session = useSession();
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-bold text-primary">
            BoneHeal
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-neutral-600 hover:text-primary">
              Produtos
            </Link>
            <Link to="/studies" className="text-neutral-600 hover:text-primary">
              Estudos
            </Link>
            <Link to="/news" className="text-neutral-600 hover:text-primary">
              Notícias
            </Link>
            <Link to="/about" className="text-neutral-600 hover:text-primary">
              Sobre
            </Link>
            <Link to="/contact" className="text-neutral-600 hover:text-primary">
              Contato
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Button>
                <Link to="/orders">
                  <Button variant="ghost">Meus Pedidos</Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button>Entrar</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <CartWidget
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
      />
    </nav>
  );
};

export default Navbar;