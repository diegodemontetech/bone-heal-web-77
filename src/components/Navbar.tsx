
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
import { Menu } from "lucide-react";
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
import { Heart } from "lucide-react";
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
        <Link to="/" className="font-bold text-2xl">
          E-commerce
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/products">Produtos</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/profile">Perfil</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/favorites" className="relative">
                <Heart className="w-6 h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {favorites.length}
                  </span>
                )}
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

        <Sheet open={open} onOpenChange={setOpen} >
          <SheetTrigger className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navegue pelo nosso e-commerce.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link to="/products">
                <Button variant="ghost" className="w-full justify-start">
                  Produtos
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" className="w-full justify-start">
                  Perfil
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
                    <Button className="w-full">Cadastrar</Button>
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
