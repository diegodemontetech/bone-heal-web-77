
import { Link, useLocation } from "react-router-dom";
import { Book, Mail, Newspaper, Info } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export const NavItems = () => {
  const location = useLocation();
  
  return (
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
  );
};
