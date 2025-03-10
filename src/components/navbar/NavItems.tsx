
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemsProps {
  mobile?: boolean;
}

export const NavItems = ({ mobile = false }: NavItemsProps) => {
  const items = [
    { href: "/", label: "Home" },
    { href: "/about", label: "Sobre" },
    { href: "/products", label: "Produtos" },
    { href: "/studies", label: "Estudos" },
    { href: "/news", label: "Notícias" },
    { href: "/contact", label: "Contato" },
  ];

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            mobile ? "w-full text-center p-2 hover:bg-muted rounded-md" : ""
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
};
