
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemsProps {
  mobile?: boolean;
  onClose?: () => void;
}

const navItems = [
  { path: "/", label: "Início" },
  { path: "/about", label: "Sobre" },
  { path: "/products", label: "Produtos" },
  { path: "/studies", label: "Estudos" },
  { path: "/news", label: "Notícias" },
  { path: "/contact", label: "Contato" },
];

export const NavItems = ({ mobile, onClose }: NavItemsProps) => {
  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  const handleClick = () => {
    if (mobile && onClose) {
      onClose();
    }
  };

  return (
    <nav className={cn("flex", mobile ? "flex-col space-y-1" : "space-x-2")}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={handleClick}
          className={cn(
            "transition-colors duration-200",
            mobile
              ? "block py-2.5 px-3 text-base rounded-md hover:bg-muted"
              : "px-3 py-2 text-sm rounded-md hover:bg-muted",
            pathname === item.path
              ? mobile 
                ? "bg-primary text-white font-medium" 
                : "font-medium text-primary"
              : "text-gray-700"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
