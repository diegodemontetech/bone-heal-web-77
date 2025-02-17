
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Book, Mail, Newspaper, Info } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/hooks/use-favorites";

export default function Navbar() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { favorites } = useFavorites();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  
  return (
    <div className="bg-background border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/675ec55f-a56b-418f-b97b-4381493c3b3f.png" alt="BoneHeal" className="h-8" />
          <span className="font-bold text-2xl text-primary">BoneHeal</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex items-center gap-6">
            <NavigationMenuItem>
              <Link to="/products" className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                <span>Produtos</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contact" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Contato</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>História</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/news" className="flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                <span>Notícias</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/studies" className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                <span>Artigos Científicos</span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                  <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => navigate("/profile")}>Perfil</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden md:flex gap-2">
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        )}

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
              <Link to="/products">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Book className="w-4 h-4" />
                  Produtos
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  Contato
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Info className="w-4 h-4" />
                  História
                </Button>
              </Link>
              <Link to="/news">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Newspaper className="w-4 h-4" />
                  Notícias
                </Button>
              </Link>
              <Link to="/studies">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Book className="w-4 h-4" />
                  Artigos Científicos
                </Button>
              </Link>
              {user ? (
                <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                  Sair
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="secondary" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full">
                      Cadastrar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
