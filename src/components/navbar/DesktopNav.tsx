
import { Link, useLocation } from "react-router-dom";
import { Book, Mail, Newspaper, Info } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function DesktopNav() {
  const location = useLocation();

  const navItems = [
    { to: "/products", icon: Book, label: "Produtos" },
    { to: "/contact", icon: Mail, label: "Contato" },
    { to: "/about", icon: Info, label: "História" },
    { to: "/news", icon: Newspaper, label: "Notícias" },
    { to: "/studies", icon: Book, label: "Artigos Científicos" },
  ];

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="flex items-center gap-8">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavigationMenuItem key={to}>
            <Link
              to={to}
              className={`flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors ${
                location.pathname === to ? "text-primary" : ""
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
