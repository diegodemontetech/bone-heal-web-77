
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Book, Mail, Newspaper, Info, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const session = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-background border-b">
      <div className="container flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/c5a855af-42eb-4ffd-8fa0-bacd9ce220b3.png"
            alt="BoneHeal" 
            className="h-10"
          />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex items-center gap-8">
            <NavigationMenuItem>
              <Link 
                to="/products" 
                className={`flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/products' ? 'text-primary' : ''}`}
              >
                <Book className="w-4 h-4" />
                <span>Produtos</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/contact"
                className={`flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/contact' ? 'text-primary' : ''}`}
              >
                <Mail className="w-4 h-4" />
                <span>Contato</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/about"
                className={`flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/about' ? 'text-primary' : ''}`}
              >
                <Info className="w-4 h-4" />
                <span>História</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/news"
                className={`flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/news' ? 'text-primary' : ''}`}
              >
                <Newspaper className="w-4 h-4" />
                <span>Notícias</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/studies"
                className={`flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/studies' ? 'text-primary' : ''}`}
              >
                <Book className="w-4 h-4" />
                <span>Artigos Científicos</span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/orders")}>
                Meus Pedidos
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden md:flex gap-2">
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
          </div>
        )}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <div className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu />
              </Button>
            </div>
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
              {session ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Meu Perfil
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full">Entrar</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
