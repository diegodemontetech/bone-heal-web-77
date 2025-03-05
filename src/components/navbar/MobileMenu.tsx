
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Book, Mail, Newspaper, Info, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";

interface MobileMenuProps {
  session: any;
}

export const MobileMenu = ({ session }: MobileMenuProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { isAdmin, profile } = useAuth();
  
  // Determina se o usuário está realmente autenticado verificando tanto a session quanto o profile
  const isAuthenticated = !!session?.user?.id || !!profile?.id;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/");
      setOpen(false);
    } catch (error: any) {
      toast.error("Erro ao sair: " + error.message);
    }
  };

  const handleAreaClick = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/profile");
    }
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden">
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navegue pelo site da BoneHeal
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Link to="/products" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Book className="w-4 h-4" />
              Produtos
            </Button>
          </Link>
          <Link to="/contact" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Mail className="w-4 h-4" />
              Contato
            </Button>
          </Link>
          <Link to="/about" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Info className="w-4 h-4" />
              História
            </Button>
          </Link>
          <Link to="/news" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Newspaper className="w-4 h-4" />
              Notícias
            </Button>
          </Link>
          <Link to="/studies" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Book className="w-4 h-4" />
              Artigos Científicos
            </Button>
          </Link>
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2" 
                onClick={handleAreaClick}
              >
                <User className="w-4 h-4" />
                {isAdmin ? "Painel Admin" : "Meu Perfil"}
              </Button>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleSignOut}
              >
                Sair
              </Button>
            </>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => {
                navigate("/login");
                setOpen(false);
              }}
            >
              Área do Dentista
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
